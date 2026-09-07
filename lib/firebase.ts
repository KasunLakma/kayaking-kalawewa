import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKeyKalawewaKayaking2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "kayaking-kalawewa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kayaking-kalawewa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kayaking-kalawewa.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "849201749",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:849201749:web:kalawewakayaking2026",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface BookingPayload {
  packageName: string;
  packageId: string;
  selectedDate: string;
  timeSlot: string;
  guestCount: number;
  kayakType?: 'Single Kayak' | 'Tandem Kayak' | string;
  totalAmountLKR: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    notes?: string;
  };
  paymentMethod: "COD" | "BANK_TRANSFER";
  customerUid?: string;
  userId?: string;
}

export interface BookingDocument extends BookingPayload {
  docId?: string;
  bookingId: string;
  paymentStatus: "PENDING_ARRIVAL" | "PAID" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: any;
}

export interface BlockedSlot {
  id?: string;
  date: string;
  timeSlot: string;
  reason: string;
  blockedAt?: any;
}

// In-Memory Fallback Cache for local demo persistence
let inMemoryBookings: BookingDocument[] = [
  {
    docId: 'demo-1',
    bookingId: 'KK-849201',
    packageName: 'Sunrise Lotus Drift',
    packageId: 'sunrise-lotus-drift',
    selectedDate: new Date().toISOString().split('T')[0],
    timeSlot: 'Morning / Sunrise (06:00 AM)',
    guestCount: 2,
    kayakType: 'Single Kayak',
    totalAmountLKR: 9000,
    customer: {
      fullName: 'Kasun Perera',
      phone: '+94771234567',
      email: 'kasun@example.com',
      notes: 'Beginner paddlers, requested Ceylon tea'
    },
    paymentMethod: 'COD',
    paymentStatus: 'PENDING_ARRIVAL',
    orderStatus: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    docId: 'demo-2',
    bookingId: 'KK-731940',
    packageName: 'Sunset Romance & Couples',
    packageId: 'sunset-romance-couples',
    selectedDate: new Date().toISOString().split('T')[0],
    timeSlot: 'Sunset Romance (05:00 PM)',
    guestCount: 2,
    kayakType: 'Tandem Kayak',
    totalAmountLKR: 7800,
    customer: {
      fullName: 'Nimali Silva',
      phone: '+94719876543',
      email: 'nimali@example.com',
      notes: 'Anniversary photo request'
    },
    paymentMethod: 'COD',
    paymentStatus: 'PENDING_ARRIVAL',
    orderStatus: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  },
  {
    docId: 'demo-3',
    bookingId: 'KK-610284',
    packageName: 'Wild Elephant Corridor Trail',
    packageId: 'wild-elephant-corridor-trail',
    selectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: 'Afternoon / Wildlife (03:30 PM)',
    guestCount: 4,
    kayakType: 'Single Kayak',
    totalAmountLKR: 34000,
    customer: {
      fullName: 'David Miller',
      phone: '+94701122334',
      email: 'david.m@example.com',
      notes: 'Telephoto camera escort requested'
    },
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  }
];

let inMemoryBlockedSlots: BlockedSlot[] = [
  {
    id: 'block-1',
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'Late Morning (09:00 AM)',
    reason: 'High Water Spillway Discharge Maintenance',
    blockedAt: new Date().toISOString()
  }
];

let inMemoryUsers: Record<string, UserProfile> = {};

export async function saveUserProfileToFirestore(profile: UserProfile): Promise<UserProfile> {
  const cleanProfile: UserProfile = {
    uid: profile.uid,
    email: profile.email,
    fullName: profile.fullName || 'Valued Guest',
    phone: profile.phone || '',
    role: profile.role || 'customer',
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryUsers[profile.uid] = cleanProfile;

  try {
    const userRef = doc(db, "users", profile.uid);
    await setDoc(userRef, {
      ...cleanProfile,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore user profile save notice (stored locally):", err);
  }

  return cleanProfile;
}

export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (inMemoryUsers[uid]) {
    return inMemoryUsers[uid];
  }

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      inMemoryUsers[uid] = data;
      return data;
    }
  } catch (err) {
    console.warn("Firestore user profile fetch notice:", err);
  }

  return null;
}

export async function saveBookingToFirestore(payload: BookingPayload): Promise<BookingDocument> {
  const generatedId = "KK-" + Date.now().toString().slice(-6);

  const bookingDoc: BookingDocument = {
    bookingId: generatedId,
    packageName: payload.packageName,
    packageId: payload.packageId,
    selectedDate: payload.selectedDate,
    timeSlot: payload.timeSlot,
    guestCount: payload.guestCount,
    kayakType: payload.kayakType || 'Single Kayak',
    totalAmountLKR: payload.totalAmountLKR,
    customer: {
      fullName: payload.customer.fullName,
      phone: payload.customer.phone,
      email: payload.customer.email,
      notes: payload.customer.notes || '',
    },
    paymentMethod: payload.paymentMethod,
    customerUid: payload.customerUid || payload.userId || '',
    userId: payload.customerUid || payload.userId || '',
    paymentStatus: "PENDING_ARRIVAL",
    orderStatus: "PENDING",
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingDoc,
      createdAt: serverTimestamp(),
    });
    bookingDoc.docId = docRef.id;
  } catch (error) {
    console.warn("Firestore write notice (handled gracefully):", error);
  }

  inMemoryBookings.unshift(bookingDoc);
  return bookingDoc;
}

export async function getUserBookingsFromFirestore(customerUid: string): Promise<BookingDocument[]> {
  if (!customerUid) return [];

  try {
    const q = query(
      collection(db, "bookings"),
      where("customerUid", "==", customerUid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const fetched: BookingDocument[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          docId: docSnap.id,
          bookingId: data.bookingId || docSnap.id,
          packageName: data.packageName || 'Kalawewa Expedition',
          packageId: data.packageId || 'custom',
          selectedDate: data.selectedDate || '',
          timeSlot: data.timeSlot || '',
          guestCount: data.guestCount || 1,
          kayakType: data.kayakType || 'Single Kayak',
          totalAmountLKR: data.totalAmountLKR || 0,
          customer: {
            fullName: data.customer?.fullName || data.fullName || 'Guest',
            phone: data.customer?.phone || data.phone || '',
            email: data.customer?.email || data.email || '',
            notes: data.customer?.notes || data.notes || '',
          },
          paymentMethod: data.paymentMethod || 'COD',
          customerUid: data.customerUid || data.userId || customerUid,
          userId: data.userId || data.customerUid || customerUid,
          paymentStatus: data.paymentStatus || 'PENDING_ARRIVAL',
          orderStatus: data.orderStatus || 'PENDING',
          createdAt: data.createdAt ? data.createdAt.toString() : new Date().toISOString(),
        });
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore user bookings query notice (filtering memory fallback):", err);
  }

  // Fallback memory filter
  return inMemoryBookings.filter(
    (b) => b.customerUid === customerUid || b.userId === customerUid || b.customer.email.toLowerCase() === customerUid.toLowerCase()
  );
}

export async function getAllBookingsFromFirestore(): Promise<BookingDocument[]> {
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const fetched: BookingDocument[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          docId: docSnap.id,
          bookingId: data.bookingId || docSnap.id,
          packageName: data.packageName || 'Kalawewa Expedition',
          packageId: data.packageId || 'custom',
          selectedDate: data.selectedDate || '',
          timeSlot: data.timeSlot || '',
          guestCount: data.guestCount || 1,
          kayakType: data.kayakType || 'Single Kayak',
          totalAmountLKR: data.totalAmountLKR || 0,
          customer: {
            fullName: data.customer?.fullName || data.fullName || 'Guest',
            phone: data.customer?.phone || data.phone || '',
            email: data.customer?.email || data.email || '',
            notes: data.customer?.notes || data.notes || '',
          },
          paymentMethod: data.paymentMethod || 'COD',
          paymentStatus: data.paymentStatus || 'PENDING_ARRIVAL',
          orderStatus: data.orderStatus || 'PENDING',
          createdAt: data.createdAt ? data.createdAt.toString() : new Date().toISOString(),
        });
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore read notice (using memory cache):", err);
  }
  return inMemoryBookings;
}

export async function updateBookingStatusInFirestore(
  docIdOrBookingId: string,
  orderStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
  paymentStatus?: "PENDING_ARRIVAL" | "PAID" | "REFUNDED"
): Promise<boolean> {
  // Update in-memory cache first
  const memoryItem = inMemoryBookings.find(
    (b) => b.docId === docIdOrBookingId || b.bookingId === docIdOrBookingId
  );
  if (memoryItem) {
    memoryItem.orderStatus = orderStatus;
    if (paymentStatus) {
      memoryItem.paymentStatus = paymentStatus;
    }
  }

  try {
    const docRef = doc(db, "bookings", docIdOrBookingId);
    const updatePayload: any = { orderStatus };
    if (paymentStatus) {
      updatePayload.paymentStatus = paymentStatus;
    }
    await updateDoc(docRef, updatePayload);
    return true;
  } catch (err) {
    console.warn("Firestore status update notice (updated local state):", err);
    return true;
  }
}

export async function getBlockedSlotsFromFirestore(): Promise<BlockedSlot[]> {
  try {
    const snapshot = await getDocs(collection(db, "blocked_slots"));
    if (!snapshot.empty) {
      const fetched: BlockedSlot[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          date: data.date,
          timeSlot: data.timeSlot,
          reason: data.reason || 'Weather Override',
          blockedAt: data.blockedAt ? data.blockedAt.toString() : new Date().toISOString(),
        });
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore blocked slots read notice:", err);
  }
  return inMemoryBlockedSlots;
}

export async function blockSlotInFirestore(
  date: string,
  timeSlot: string,
  reason: string
): Promise<BlockedSlot> {
  const newBlock: BlockedSlot = {
    id: 'block-' + Date.now(),
    date,
    timeSlot,
    reason: reason || 'Emergency Weather / Spillway Override',
    blockedAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "blocked_slots"), {
      date,
      timeSlot,
      reason: newBlock.reason,
      blockedAt: serverTimestamp(),
    });
    newBlock.id = docRef.id;
  } catch (err) {
    console.warn("Firestore block slot write notice:", err);
  }

  inMemoryBlockedSlots.push(newBlock);
  return newBlock;
}

export async function unblockSlotInFirestore(slotId: string): Promise<boolean> {
  inMemoryBlockedSlots = inMemoryBlockedSlots.filter((s) => s.id !== slotId);
  try {
    await deleteDoc(doc(db, "blocked_slots", slotId));
  } catch (err) {
    console.warn("Firestore unblock slot notice:", err);
  }
  return true;
}

// ----------------------------------------------------
// STAFF MANAGEMENT DATA TYPES & FIRESTORE HELPERS
// ----------------------------------------------------

export interface StaffMember {
  id: string; // Staff ID, e.g. STF-101
  fullName: string;
  email: string;
  phone: string;
  role: 'Naturalist Guide' | 'Reservation Desk' | 'Operations Manager' | 'Safety Officer' | 'Kayak Master' | string;
  status: 'ACTIVE' | 'OFF_DUTY' | 'SUSPENDED';
  avatarUrl?: string;
  expeditions: string[];
  lastActive: string;
  createdAt: string;
  uid?: string;
}

export interface StaffActivityLog {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  timestamp: string;
  type: 'LOGIN' | 'EXPEDITION' | 'RESERVATION' | 'PROFILE';
}

let inMemoryStaffMembers: StaffMember[] = [
  {
    id: 'STF-101',
    fullName: 'Sahan Wickramasinghe',
    email: 'sahan@kalawewakayaking.com',
    phone: '+94771239876',
    role: 'Naturalist Guide',
    status: 'ACTIVE',
    expeditions: ['Sunrise Lotus Drift', 'Wild Elephant Corridor Trail'],
    lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
    createdAt: '2026-01-10T08:00:00.000Z',
    uid: 'staff-uid-101'
  },
  {
    id: 'STF-102',
    fullName: 'Dilani Fernando',
    email: 'dilani@kalawewakayaking.com',
    phone: '+94718882233',
    role: 'Reservation Desk',
    status: 'ACTIVE',
    expeditions: ['Sunrise Lotus Drift', 'Sunset Romance & Couples', 'Full Day Kalawewa Explorer'],
    lastActive: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: '2026-01-15T09:30:00.000Z',
    uid: 'staff-uid-102'
  },
  {
    id: 'STF-103',
    fullName: 'Kusal Jayawardena',
    email: 'kusal@kalawewakayaking.com',
    phone: '+94705554411',
    role: 'Operations Manager',
    status: 'ACTIVE',
    expeditions: ['All Expeditions & Spillway Safety Protocol'],
    lastActive: new Date(Date.now() - 45 * 60000).toISOString(),
    createdAt: '2026-01-01T07:00:00.000Z',
    uid: 'staff-uid-103'
  },
  {
    id: 'STF-104',
    fullName: 'Roshan Bandara',
    email: 'roshan@kalawewakayaking.com',
    phone: '+94762229988',
    role: 'Safety Officer',
    status: 'OFF_DUTY',
    expeditions: ['Wild Elephant Corridor Trail', 'Emergency Rapid Response'],
    lastActive: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdAt: '2026-02-01T10:00:00.000Z',
    uid: 'staff-uid-104'
  },
  {
    id: 'STF-105',
    fullName: 'Tharindu Rathnayake',
    email: 'tharindu@kalawewakayaking.com',
    phone: '+94723334455',
    role: 'Kayak Master',
    status: 'SUSPENDED',
    expeditions: ['Sunset Romance & Couples'],
    lastActive: new Date(Date.now() - 7 * 86400000).toISOString(),
    createdAt: '2026-03-01T11:00:00.000Z',
    uid: 'staff-uid-105'
  }
];

let inMemoryStaffLogs: StaffActivityLog[] = [
  {
    id: 'log-1',
    staffId: 'STF-101',
    staffName: 'Sahan Wickramasinghe',
    action: 'Completed Sunrise Lotus Drift expedition with 4 guests',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    type: 'EXPEDITION'
  },
  {
    id: 'log-2',
    staffId: 'STF-102',
    staffName: 'Dilani Fernando',
    action: 'Confirmed reservation #KK-731940 and sent guest welcome kit',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    type: 'RESERVATION'
  },
  {
    id: 'log-3',
    staffId: 'STF-103',
    staffName: 'Kusal Jayawardena',
    action: 'Logged into Operations Portal and issued weather advisory update',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    type: 'LOGIN'
  },
  {
    id: 'log-4',
    staffId: 'STF-101',
    staffName: 'Sahan Wickramasinghe',
    action: 'Logged into Staff Portal',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: 'LOGIN'
  }
];

export async function getStaffMembersFromFirestore(): Promise<StaffMember[]> {
  try {
    const snapshot = await getDocs(collection(db, "staff"));
    if (!snapshot.empty) {
      const fetched: StaffMember[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          fullName: data.fullName || 'Staff Member',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'Naturalist Guide',
          status: data.status || 'ACTIVE',
          avatarUrl: data.avatarUrl || '',
          expeditions: Array.isArray(data.expeditions) ? data.expeditions : [],
          lastActive: data.lastActive || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString(),
          uid: data.uid || docSnap.id,
        });
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore staff read notice (using in-memory store):", err);
  }
  return inMemoryStaffMembers;
}

export async function saveStaffMemberToFirestore(
  staffData: Omit<StaffMember, 'id'> & { id?: string }
): Promise<StaffMember> {
  const staffId = staffData.id || "STF-" + Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();

  const newStaff: StaffMember = {
    id: staffId,
    fullName: staffData.fullName,
    email: staffData.email,
    phone: staffData.phone,
    role: staffData.role,
    status: staffData.status || 'ACTIVE',
    avatarUrl: staffData.avatarUrl || '',
    expeditions: staffData.expeditions || [],
    lastActive: now,
    createdAt: staffData.createdAt || now,
    uid: staffData.uid || `staff-uid-${Date.now()}`
  };

  try {
    const docRef = doc(db, "staff", staffId);
    await setDoc(docRef, {
      ...newStaff,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore save staff notice (saved locally):", err);
  }

  // Update in-memory cache
  const existingIdx = inMemoryStaffMembers.findIndex(s => s.id === staffId);
  if (existingIdx >= 0) {
    inMemoryStaffMembers[existingIdx] = newStaff;
  } else {
    inMemoryStaffMembers.unshift(newStaff);
  }

  // Add initial log
  await addStaffLogToFirestore({
    staffId: newStaff.id,
    staffName: newStaff.fullName,
    action: `Staff profile created & provisioned with role [${newStaff.role}]`,
    timestamp: now,
    type: 'PROFILE'
  });

  return newStaff;
}

export async function updateStaffMemberInFirestore(
  staffId: string,
  updates: Partial<StaffMember>
): Promise<boolean> {
  const idx = inMemoryStaffMembers.findIndex(s => s.id === staffId);
  if (idx >= 0) {
    inMemoryStaffMembers[idx] = {
      ...inMemoryStaffMembers[idx],
      ...updates,
      lastActive: new Date().toISOString()
    };
  }

  try {
    const docRef = doc(db, "staff", staffId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn("Firestore staff update notice:", err);
  }

  return true;
}

export async function deleteStaffMemberFromFirestore(staffId: string): Promise<boolean> {
  inMemoryStaffMembers = inMemoryStaffMembers.filter(s => s.id !== staffId);
  try {
    await deleteDoc(doc(db, "staff", staffId));
  } catch (err) {
    console.warn("Firestore staff delete notice:", err);
  }
  return true;
}

export async function getStaffLogsFromFirestore(staffId?: string): Promise<StaffActivityLog[]> {
  try {
    const snapshot = await getDocs(collection(db, "staff_logs"));
    if (!snapshot.empty) {
      const fetched: StaffActivityLog[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!staffId || data.staffId === staffId) {
          fetched.push({
            id: docSnap.id,
            staffId: data.staffId,
            staffName: data.staffName || 'Staff Member',
            action: data.action || 'Activity logged',
            timestamp: data.timestamp || new Date().toISOString(),
            type: data.type || 'LOGIN'
          });
        }
      });
      return fetched.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch (err) {
    console.warn("Firestore staff logs read notice:", err);
  }

  let logs = [...inMemoryStaffLogs];
  if (staffId) {
    logs = logs.filter(l => l.staffId === staffId);
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function addStaffLogToFirestore(
  logData: Omit<StaffActivityLog, 'id'>
): Promise<StaffActivityLog> {
  const newLog: StaffActivityLog = {
    id: 'log-' + Date.now(),
    staffId: logData.staffId,
    staffName: logData.staffName,
    action: logData.action,
    timestamp: logData.timestamp || new Date().toISOString(),
    type: logData.type
  };

  try {
    const docRef = await addDoc(collection(db, "staff_logs"), {
      ...newLog,
      createdAt: serverTimestamp()
    });
    newLog.id = docRef.id;
  } catch (err) {
    console.warn("Firestore add staff log notice:", err);
  }

  inMemoryStaffLogs.unshift(newLog);
  return newLog;
}

// ----------------------------------------------------
// FLEET & KAYAK INVENTORY DATA TYPES & FIRESTORE HELPERS
// ----------------------------------------------------

export interface FleetVehicle {
  id: string; // e.g., "KALA-KAYAK-01", "KALA-TANDEM-03"
  identifier: string; // e.g. "Single Ocean Explorer #1", "Tandem Ocean Pro #3"
  craftType: 'Single Kayak' | 'Tandem Kayak' | 'Safari Transfer Vehicle' | 'Rescue Tender' | string;
  capacity: number; // e.g. 1 for Single Kayak, 2 for Tandem Kayak, 10 for Safari Transfer, 4 for Rescue Tender
  conditionStatus: 'Operational' | 'Under Inspection' | 'Out of Service';
  availabilityStatus: 'Available' | 'On Lake / Reserved' | 'Reserved Maintenance';
  safetyEquipment: {
    lifeJacketCount: number;
    paddleSerials: string[];
    emergencyKitChecked: boolean;
    uscgCompliant: boolean;
    lastInspectionDate: string;
  };
  acquisitionDate: string;
  lastMaintenanceLog: string;
  assignedPackages: string[]; // e.g. ['Sunrise Lotus Drift', 'Wild Elephant Corridor Trail']
  createdAt: string;
  updatedAt?: string;
}

let inMemoryFleet: FleetVehicle[] = [
  {
    id: 'KALA-KAYAK-01',
    identifier: 'Single Ocean Explorer #1',
    craftType: 'Single Kayak',
    capacity: 1,
    conditionStatus: 'Operational',
    availabilityStatus: 'Available',
    safetyEquipment: {
      lifeJacketCount: 1,
      paddleSerials: ['PD-01A', 'PD-01B'],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-08-25',
    },
    acquisitionDate: '2025-06-15',
    lastMaintenanceLog: 'Hull polished, Rudder cable tensioned & seat cushion replaced.',
    assignedPackages: ['Sunrise Lotus Drift', 'Wild Elephant Corridor Trail', '5th Century Island Exploration'],
    createdAt: '2025-06-15T08:00:00.000Z',
  },
  {
    id: 'KALA-KAYAK-02',
    identifier: 'Single Ocean Explorer #2',
    craftType: 'Single Kayak',
    capacity: 1,
    conditionStatus: 'Operational',
    availabilityStatus: 'On Lake / Reserved',
    safetyEquipment: {
      lifeJacketCount: 1,
      paddleSerials: ['PD-02A'],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-08-25',
    },
    acquisitionDate: '2025-06-15',
    lastMaintenanceLog: 'Safety line re-secured. Passed USCG buoy testing.',
    assignedPackages: ['Sunrise Lotus Drift', 'Wild Elephant Corridor Trail'],
    createdAt: '2025-06-15T08:00:00.000Z',
  },
  {
    id: 'KALA-KAYAK-03',
    identifier: 'Single Ocean Explorer #3',
    craftType: 'Single Kayak',
    capacity: 1,
    conditionStatus: 'Under Inspection',
    availabilityStatus: 'Reserved Maintenance',
    safetyEquipment: {
      lifeJacketCount: 1,
      paddleSerials: ['PD-03A'],
      emergencyKitChecked: false,
      uscgCompliant: false,
      lastInspectionDate: '2026-07-10',
    },
    acquisitionDate: '2025-07-01',
    lastMaintenanceLog: 'Scheduled for drain plug seal replacement after spillway trial.',
    assignedPackages: ['Sunrise Lotus Drift'],
    createdAt: '2025-07-01T09:00:00.000Z',
  },
  {
    id: 'KALA-TANDEM-01',
    identifier: 'Tandem Ocean Pro #1',
    craftType: 'Tandem Kayak',
    capacity: 2,
    conditionStatus: 'Operational',
    availabilityStatus: 'Available',
    safetyEquipment: {
      lifeJacketCount: 2,
      paddleSerials: ['PD-T01A', 'PD-T01B'],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-08-30',
    },
    acquisitionDate: '2025-08-10',
    lastMaintenanceLog: 'Dual backrests upgraded with ergonomic lumbar support.',
    assignedPackages: ['Sunset Romance & Couples', '5th Century Island Exploration'],
    createdAt: '2025-08-10T10:00:00.000Z',
  },
  {
    id: 'KALA-TANDEM-02',
    identifier: 'Tandem Ocean Pro #2',
    craftType: 'Tandem Kayak',
    capacity: 2,
    conditionStatus: 'Operational',
    availabilityStatus: 'On Lake / Reserved',
    safetyEquipment: {
      lifeJacketCount: 2,
      paddleSerials: ['PD-T02A', 'PD-T02B'],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-08-30',
    },
    acquisitionDate: '2025-08-10',
    lastMaintenanceLog: 'Full hull wash down & UV protective coating applied.',
    assignedPackages: ['Sunset Romance & Couples'],
    createdAt: '2025-08-10T10:00:00.000Z',
  },
  {
    id: 'KALA-TANDEM-03',
    identifier: 'Tandem Ocean Pro #3',
    craftType: 'Tandem Kayak',
    capacity: 2,
    conditionStatus: 'Operational',
    availabilityStatus: 'Available',
    safetyEquipment: {
      lifeJacketCount: 2,
      paddleSerials: ['PD-T03A', 'PD-T03B'],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-09-01',
    },
    acquisitionDate: '2025-09-05',
    lastMaintenanceLog: 'New carbon-fiber lightweight paddles issued.',
    assignedPackages: ['Sunset Romance & Couples', 'Sunrise Lotus Drift'],
    createdAt: '2025-09-05T11:00:00.000Z',
  },
  {
    id: 'KALA-SAFARI-01',
    identifier: 'Kalawewa Safari Transfer Rover #1',
    craftType: 'Safari Transfer Vehicle',
    capacity: 10,
    conditionStatus: 'Operational',
    availabilityStatus: 'Available',
    safetyEquipment: {
      lifeJacketCount: 12,
      paddleSerials: [],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-08-20',
    },
    acquisitionDate: '2024-11-20',
    lastMaintenanceLog: '4WD transfer gearbox serviced, off-road tires rotated & winch tested.',
    assignedPackages: ['Wild Elephant Corridor Trail', 'Full Day Kalawewa Explorer'],
    createdAt: '2024-11-20T08:00:00.000Z',
  },
  {
    id: 'KALA-RESCUE-01',
    identifier: 'Lake Sentinel Rescue Tender #1',
    craftType: 'Rescue Tender',
    capacity: 4,
    conditionStatus: 'Operational',
    availabilityStatus: 'Available',
    safetyEquipment: {
      lifeJacketCount: 6,
      paddleSerials: ['PD-R01A', 'PD-R01B'],
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: '2026-09-02',
    },
    acquisitionDate: '2025-03-12',
    lastMaintenanceLog: 'Outboard emergency motor oil changed, throw lines re-spooled, VHF radio checked.',
    assignedPackages: ['Emergency Rapid Response & Safety Protocol', 'All Expeditions'],
    createdAt: '2025-03-12T07:30:00.000Z',
  },
];

export async function getFleetVehiclesFromFirestore(): Promise<FleetVehicle[]> {
  try {
    const snapshot = await getDocs(collection(db, "fleet"));
    if (!snapshot.empty) {
      const fetched: FleetVehicle[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          identifier: data.identifier || docSnap.id,
          craftType: data.craftType || 'Single Kayak',
          capacity: data.capacity || 1,
          conditionStatus: data.conditionStatus || 'Operational',
          availabilityStatus: data.availabilityStatus || 'Available',
          safetyEquipment: {
            lifeJacketCount: data.safetyEquipment?.lifeJacketCount ?? 1,
            paddleSerials: Array.isArray(data.safetyEquipment?.paddleSerials) ? data.safetyEquipment.paddleSerials : [],
            emergencyKitChecked: data.safetyEquipment?.emergencyKitChecked ?? true,
            uscgCompliant: data.safetyEquipment?.uscgCompliant ?? true,
            lastInspectionDate: data.safetyEquipment?.lastInspectionDate || new Date().toISOString().split('T')[0],
          },
          acquisitionDate: data.acquisitionDate || new Date().toISOString().split('T')[0],
          lastMaintenanceLog: data.lastMaintenanceLog || 'Routine check passed',
          assignedPackages: Array.isArray(data.assignedPackages) ? data.assignedPackages : [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore fleet read notice (using in-memory fleet store):", err);
  }
  return inMemoryFleet;
}

export async function saveFleetVehicleToFirestore(
  vehicleData: Omit<FleetVehicle, 'id'> & { id?: string }
): Promise<FleetVehicle> {
  const vId = vehicleData.id || "KALA-CRAFT-" + Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();

  const newVehicle: FleetVehicle = {
    id: vId,
    identifier: vehicleData.identifier,
    craftType: vehicleData.craftType,
    capacity: Number(vehicleData.capacity) || 1,
    conditionStatus: vehicleData.conditionStatus || 'Operational',
    availabilityStatus: vehicleData.availabilityStatus || 'Available',
    safetyEquipment: {
      lifeJacketCount: Number(vehicleData.safetyEquipment?.lifeJacketCount) || 1,
      paddleSerials: vehicleData.safetyEquipment?.paddleSerials || [],
      emergencyKitChecked: vehicleData.safetyEquipment?.emergencyKitChecked ?? true,
      uscgCompliant: vehicleData.safetyEquipment?.uscgCompliant ?? true,
      lastInspectionDate: vehicleData.safetyEquipment?.lastInspectionDate || new Date().toISOString().split('T')[0],
    },
    acquisitionDate: vehicleData.acquisitionDate || new Date().toISOString().split('T')[0],
    lastMaintenanceLog: vehicleData.lastMaintenanceLog || 'Newly registered craft in inventory.',
    assignedPackages: vehicleData.assignedPackages || [],
    createdAt: vehicleData.createdAt || now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, "fleet", vId);
    await setDoc(docRef, {
      ...newVehicle,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore save fleet vehicle notice (saved in local memory):", err);
  }

  const existingIdx = inMemoryFleet.findIndex((f) => f.id === vId);
  if (existingIdx >= 0) {
    inMemoryFleet[existingIdx] = newVehicle;
  } else {
    inMemoryFleet.unshift(newVehicle);
  }

  return newVehicle;
}

export async function updateFleetVehicleInFirestore(
  vId: string,
  updates: Partial<FleetVehicle>
): Promise<boolean> {
  const idx = inMemoryFleet.findIndex((f) => f.id === vId);
  if (idx >= 0) {
    inMemoryFleet[idx] = {
      ...inMemoryFleet[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const docRef = doc(db, "fleet", vId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore fleet vehicle update notice:", err);
  }

  return true;
}

export async function deleteFleetVehicleFromFirestore(vId: string): Promise<boolean> {
  inMemoryFleet = inMemoryFleet.filter((f) => f.id !== vId);
  try {
    await deleteDoc(doc(db, "fleet", vId));
  } catch (err) {
    console.warn("Firestore fleet vehicle delete notice:", err);
  }
  return true;
}

export function calculateFleetCapacitySummary(fleet: FleetVehicle[]) {
  const operationalFleet = fleet.filter((f) => f.conditionStatus === 'Operational');
  const availableFleet = fleet.filter((f) => f.conditionStatus === 'Operational' && f.availabilityStatus === 'Available');
  const onLakeFleet = fleet.filter((f) => f.availabilityStatus === 'On Lake / Reserved');
  const maintenanceFleet = fleet.filter((f) => f.conditionStatus !== 'Operational' || f.availabilityStatus === 'Reserved Maintenance');

  const singleKayaksCount = operationalFleet.filter((f) => f.craftType === 'Single Kayak').length;
  const tandemKayaksCount = operationalFleet.filter((f) => f.craftType === 'Tandem Kayak').length;
  const safariVehiclesCount = operationalFleet.filter((f) => f.craftType === 'Safari Transfer Vehicle').length;
  const rescueTendersCount = operationalFleet.filter((f) => f.craftType === 'Rescue Tender').length;

  const totalKayakSeats = (singleKayaksCount * 1) + (tandemKayaksCount * 2);
  const totalAvailableSeats = availableFleet.reduce((sum, f) => sum + f.capacity, 0);

  return {
    totalFleetSize: fleet.length,
    operationalCount: operationalFleet.length,
    availableCount: availableFleet.length,
    onLakeCount: onLakeFleet.length,
    maintenanceCount: maintenanceFleet.length,
    singleKayaksCount,
    tandemKayaksCount,
    safariVehiclesCount,
    rescueTendersCount,
    totalKayakSeats,
    totalAvailableSeats,
  };
}


