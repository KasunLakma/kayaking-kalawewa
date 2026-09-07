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

// ----------------------------------------------------
// RBAC & PERMISSIONS DATA TYPES & FIRESTORE HELPERS
// ----------------------------------------------------

export interface PermissionItem {
  key: string;
  name: string;
  description: string;
}

export interface PermissionCategory {
  category: string;
  description: string;
  permissions: PermissionItem[];
}

export const SYSTEM_PERMISSIONS: PermissionCategory[] = [
  {
    category: 'Bookings & Expeditions',
    description: 'Control reservation processing, creation, edits, cancellations, and export permissions',
    permissions: [
      { key: 'bookings.view', name: 'View Bookings Feed', description: 'Access reservation roster, customer notes, and expedition schedules.' },
      { key: 'bookings.create', name: 'Create Reservations', description: 'Book guests into slots on behalf of walk-ins or phone inquiries.' },
      { key: 'bookings.edit', name: 'Edit Reservations', description: 'Modify guest counts, package choices, date/times, and contact info.' },
      { key: 'bookings.cancel', name: 'Cancel Reservations', description: 'Cancel existing bookings and process refund requests.' },
      { key: 'bookings.export', name: 'Export Roster & Manifests', description: 'Download CSV / PDF daily expedition manifests for naturalist guides.' },
    ],
  },
  {
    category: 'Fleet & Watercraft Inventory',
    description: 'Control craft registration, condition status toggles, safety checks, and maintenance logs',
    permissions: [
      { key: 'fleet.view', name: 'View Fleet Inventory', description: 'Inspect watercraft inventory, PFD counts, and paddle serials.' },
      { key: 'fleet.add', name: 'Add New Craft / Vehicle', description: 'Register new kayaks, tenders, or safari rovers into inventory.' },
      { key: 'fleet.edit_status', name: 'Toggle Condition & Availability', description: 'Switch craft between Operational, Under Inspection, and Out of Service.' },
      { key: 'fleet.maintenance_log', name: 'Update Maintenance & Safety Logs', description: 'Record USCG buoy test notes, hull checks, and pass safety inspections.' },
    ],
  },
  {
    category: 'Staff & Naturalist Roster',
    description: 'Control staff account provisioning, role assignments, status toggles, and activity logs',
    permissions: [
      { key: 'staff.view', name: 'View Staff Roster', description: 'Inspect guide list, contact info, shift statuses, and activity history.' },
      { key: 'staff.invite', name: 'Invite & Provision Staff', description: 'Create new staff user profiles and issue system invitations.' },
      { key: 'staff.edit_role', name: 'Edit Staff Permissions', description: 'Modify assigned guide roles, expedition tags, and phone contacts.' },
      { key: 'staff.deactivate', name: 'Deactivate / Suspend Staff', description: 'Suspend staff accounts or set duty status to off-duty/suspended.' },
    ],
  },
  {
    category: 'Financials & Audit Reports',
    description: 'Control revenue metrics visibility, payment status updates, and audit report downloads',
    permissions: [
      { key: 'financials.view_totals', name: 'View Financial Totals', description: 'Access revenue metrics, total sales volume, and payment statuses.' },
      { key: 'financials.export_audits', name: 'Export Financial Audit Reports', description: 'Download revenue breakdown and audit logs for accounting.' },
    ],
  },
  {
    category: 'System Settings & Overrides',
    description: 'Control emergency weather slot overrides, global portal config, and RBAC rules',
    permissions: [
      { key: 'settings.manage_global_config', name: 'Emergency Weather Override', description: 'Enforce lake weather slot blocks and spillway emergency lockdowns.' },
      { key: 'settings.general', name: 'Manage System Settings & RBAC', description: 'Configure global portal settings, RBAC matrices, and PIN gates.' },
    ],
  },
];

export interface RoleDefinition {
  id: string; // 'super_admin' | 'operations_manager' | 'naturalist_guide' | 'front_desk' | string
  name: string;
  description: string;
  isSystemRole: boolean;
  permissions: string[];
  updatedAt?: string;
}

const ALL_PERMISSION_KEYS = SYSTEM_PERMISSIONS.flatMap((c) => c.permissions.map((p) => p.key));

let inMemoryRoles: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full system control, financial log auditing, RBAC security configuration, and emergency overrides.',
    isSystemRole: true,
    permissions: [...ALL_PERMISSION_KEYS],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'operations_manager',
    name: 'Operations Manager',
    description: 'Full operational control over Bookings, Fleet Inventory, Staff Roster, and Lake Kalawewa schedules.',
    isSystemRole: true,
    permissions: [
      'bookings.view',
      'bookings.create',
      'bookings.edit',
      'bookings.cancel',
      'bookings.export',
      'fleet.view',
      'fleet.add',
      'fleet.edit_status',
      'fleet.maintenance_log',
      'staff.view',
      'staff.invite',
      'staff.edit_role',
      'financials.view_totals',
      'settings.manage_global_config',
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'naturalist_guide',
    name: 'Naturalist / Guide',
    description: 'View assigned expedition manifests, guest rosters, safety protocols, and watercraft logs.',
    isSystemRole: true,
    permissions: [
      'bookings.view',
      'bookings.export',
      'fleet.view',
      'fleet.edit_status',
      'fleet.maintenance_log',
      'staff.view',
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'front_desk',
    name: 'Concierge / Front Desk',
    description: 'Create and manage guest bookings, handle arrival check-ins, and inspect fleet availability.',
    isSystemRole: true,
    permissions: [
      'bookings.view',
      'bookings.create',
      'bookings.edit',
      'bookings.cancel',
      'fleet.view',
      'staff.view',
    ],
    updatedAt: new Date().toISOString(),
  },
];

export async function getRolesFromFirestore(): Promise<RoleDefinition[]> {
  try {
    const snapshot = await getDocs(collection(db, "roles"));
    if (!snapshot.empty) {
      const fetched: RoleDefinition[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          name: data.name || docSnap.id,
          description: data.description || '',
          isSystemRole: data.isSystemRole ?? false,
          permissions: Array.isArray(data.permissions) ? data.permissions : [],
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore roles read notice (using in-memory store):", err);
  }
  return inMemoryRoles;
}

export async function saveRoleToFirestore(role: RoleDefinition): Promise<RoleDefinition> {
  const now = new Date().toISOString();
  const updatedRole: RoleDefinition = {
    ...role,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, "roles", role.id);
    await setDoc(docRef, {
      ...updatedRole,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore save role notice (saved in local memory):", err);
  }

  const existingIdx = inMemoryRoles.findIndex((r) => r.id === role.id);
  if (existingIdx >= 0) {
    inMemoryRoles[existingIdx] = updatedRole;
  } else {
    inMemoryRoles.push(updatedRole);
  }

  return updatedRole;
}

export async function updateRolePermissionsInFirestore(
  roleId: string,
  permissions: string[]
): Promise<boolean> {
  const idx = inMemoryRoles.findIndex((r) => r.id === roleId);
  if (idx >= 0) {
    inMemoryRoles[idx] = {
      ...inMemoryRoles[idx],
      permissions,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const docRef = doc(db, "roles", roleId);
    await updateDoc(docRef, {
      permissions,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore role permissions update notice:", err);
  }

  return true;
}

export async function resetDefaultRolesInFirestore(): Promise<RoleDefinition[]> {
  const now = new Date().toISOString();
  inMemoryRoles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Full system control, financial log auditing, RBAC security configuration, and emergency overrides.',
      isSystemRole: true,
      permissions: [...ALL_PERMISSION_KEYS],
      updatedAt: now,
    },
    {
      id: 'operations_manager',
      name: 'Operations Manager',
      description: 'Full operational control over Bookings, Fleet Inventory, Staff Roster, and Lake Kalawewa schedules.',
      isSystemRole: true,
      permissions: [
        'bookings.view',
        'bookings.create',
        'bookings.edit',
        'bookings.cancel',
        'bookings.export',
        'fleet.view',
        'fleet.add',
        'fleet.edit_status',
        'fleet.maintenance_log',
        'staff.view',
        'staff.invite',
        'staff.edit_role',
        'financials.view_totals',
        'settings.manage_global_config',
      ],
      updatedAt: now,
    },
    {
      id: 'naturalist_guide',
      name: 'Naturalist / Guide',
      description: 'View assigned expedition manifests, guest rosters, safety protocols, and watercraft logs.',
      isSystemRole: true,
      permissions: [
        'bookings.view',
        'bookings.export',
        'fleet.view',
        'fleet.edit_status',
        'fleet.maintenance_log',
        'staff.view',
      ],
      updatedAt: now,
    },
    {
      id: 'front_desk',
      name: 'Concierge / Front Desk',
      description: 'Create and manage guest bookings, handle arrival check-ins, and inspect fleet availability.',
      isSystemRole: true,
      permissions: [
        'bookings.view',
        'bookings.create',
        'bookings.edit',
        'bookings.cancel',
        'fleet.view',
        'staff.view',
      ],
      updatedAt: now,
    },
  ];

  try {
    for (const r of inMemoryRoles) {
      const docRef = doc(db, "roles", r.id);
      await setDoc(docRef, { ...r, updatedAt: serverTimestamp() }, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore reset default roles notice:", err);
  }

  return inMemoryRoles;
}

export function hasPermission(roleId: string, permissionKey: string): boolean {
  const role = inMemoryRoles.find((r) => r.id === roleId);
  if (!role) return false;
  if (role.id === 'super_admin') return true;
  return role.permissions.includes(permissionKey);
}

/* ==========================================================================
   CUSTOMER MANAGEMENT MODULE (QA Report v1.1 Requirement)
   ========================================================================== */

export interface CustomerContactLog {
  id: string;
  createdAt: string;
  author: string;
  category: 'Interaction' | 'Preference' | 'Safety' | 'Special Request' | 'General Note';
  note: string;
}

export interface CustomerProfile {
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  phone: string;
  hasWhatsapp?: boolean;
  memberSince: string;
  tier: 'VIP' | 'Regular' | 'Wilderness Elite' | 'Corporate';
  dietaryPreferences?: string;
  safetyNotes?: string;
  emergencyContact?: string;
  contactLogs?: CustomerContactLog[];
  // Calculated/Aggregated fields
  totalBookings?: number;
  completedExpeditions?: number;
  totalSpendLKR?: number;
  bookings?: BookingDocument[];
}

let inMemoryCustomers: CustomerProfile[] = [
  {
    id: 'cust-1',
    uid: 'user-kasun-1',
    fullName: 'Kasun Perera',
    email: 'kasun@example.com',
    phone: '+94771234567',
    hasWhatsapp: true,
    memberSince: '2026-01-15',
    tier: 'VIP',
    dietaryPreferences: 'No seafood, prefers Ceylon spiced herbal tea',
    safetyNotes: 'Beginner kayaker, requires life vest check & safety briefing',
    emergencyContact: '+94779998877 (Spouse: Chathuri)',
    contactLogs: [
      {
        id: 'log-101',
        createdAt: '2026-02-10T09:30:00Z',
        author: 'Saman Kumara (Front Desk)',
        category: 'Preference',
        note: 'Requested morning sunrise slot on every visit. Prefers single touring kayak.',
      },
      {
        id: 'log-102',
        createdAt: '2026-03-01T14:15:00Z',
        author: 'Anura Bandara (Lead Guide)',
        category: 'Safety',
        note: 'Completed safety orientation. Comfortable in moderate spillway currents.',
      },
    ],
  },
  {
    id: 'cust-2',
    uid: 'user-nimali-2',
    fullName: 'Nimali Silva',
    email: 'nimali@example.com',
    phone: '+94719876543',
    hasWhatsapp: true,
    memberSince: '2026-02-02',
    tier: 'Wilderness Elite',
    dietaryPreferences: 'Strictly Vegetarian, vegan snacks preferred',
    safetyNotes: 'Intermediate paddler, keen wildlife photography escort',
    emergencyContact: '+94712223344 (Brother: Ruwan)',
    contactLogs: [
      {
        id: 'log-201',
        createdAt: '2026-02-20T11:00:00Z',
        author: 'Dinesh Jayasinghe (Concierge)',
        category: 'Special Request',
        note: 'Anniversary couples package booked. Requested water-resistant camera dry bag.',
      },
    ],
  },
  {
    id: 'cust-3',
    uid: 'user-david-3',
    fullName: 'David Miller',
    email: 'david.m@example.com',
    phone: '+94701122334',
    hasWhatsapp: true,
    memberSince: '2026-08-10',
    tier: 'Corporate',
    dietaryPreferences: 'Gluten-free snacks, fresh fruit platters',
    safetyNotes: 'Advanced kayaker, telephoto camera gear safety harness requested',
    emergencyContact: '+1 415 555 0199 (US Emergency Contact)',
    contactLogs: [
      {
        id: 'log-301',
        createdAt: '2026-08-12T16:45:00Z',
        author: 'Saman Kumara (Front Desk)',
        category: 'Interaction',
        note: 'National Geographic freelance photographer. Inquired about wild elephant corridor photography charter.',
      },
    ],
  },
  {
    id: 'cust-4',
    uid: 'user-anura-4',
    fullName: 'Dr. Anura Senanayake',
    email: 'anura.s@example.com',
    phone: '+94714567890',
    hasWhatsapp: false,
    memberSince: '2025-12-01',
    tier: 'VIP',
    dietaryPreferences: 'Standard gourmet lunch pack',
    safetyNotes: 'Expert paddler, first-aid certified',
    emergencyContact: '+94718887766 (Clinic Desk)',
    contactLogs: [
      {
        id: 'log-401',
        createdAt: '2026-01-05T10:00:00Z',
        author: 'Anura Bandara (Lead Guide)',
        category: 'General Note',
        note: 'Regular weekend visitor. Likes early 06:00 AM departures before wind picks up.',
      },
    ],
  },
];

/**
 * Fetch all unified customer profiles by merging Firestore `users` records
 * with guest booking records from the `bookings` collection.
 */
export async function getAllCustomersFromFirestore(): Promise<CustomerProfile[]> {
  try {
    const allBookings = await getAllBookingsFromFirestore();
    const customerMap = new Map<string, CustomerProfile>();

    // 1. Initialize from stored inMemoryCustomers first as base seed
    inMemoryCustomers.forEach((cust) => {
      customerMap.set(cust.email.toLowerCase(), { ...cust, contactLogs: [...(cust.contactLogs || [])] });
    });

    // 2. Fetch users from Firestore `users` collection if available
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        usersSnap.forEach((docSnap) => {
          const uData = docSnap.data();
          const emailKey = (uData.email || '').toLowerCase();
          if (emailKey) {
            const existing = customerMap.get(emailKey);
            const profile: CustomerProfile = {
              id: docSnap.id,
              uid: docSnap.id,
              fullName: uData.fullName || existing?.fullName || 'Valued Guest',
              email: uData.email || existing?.email || '',
              phone: uData.phone || existing?.phone || '',
              hasWhatsapp: true,
              memberSince: uData.createdAt ? uData.createdAt.toString().split('T')[0] : existing?.memberSince || '2026-01-01',
              tier: existing?.tier || 'Regular',
              dietaryPreferences: uData.dietaryPreferences || existing?.dietaryPreferences || '',
              safetyNotes: uData.safetyNotes || existing?.safetyNotes || '',
              emergencyContact: uData.emergencyContact || existing?.emergencyContact || '',
              contactLogs: existing?.contactLogs || [],
            };
            customerMap.set(emailKey, profile);
          }
        });
      }
    } catch (userErr) {
      console.warn("Firestore `users` collection query notice (using merged memory cache):", userErr);
    }

    // 3. Aggregate bookings for each customer by email / userId
    allBookings.forEach((b) => {
      const emailKey = (b.customer?.email || '').toLowerCase();
      if (!emailKey) return;

      let cust = customerMap.get(emailKey);
      if (!cust) {
        // Create new guest customer from booking data
        const newId = 'cust-' + Math.abs(emailKey.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16);
        cust = {
          id: newId,
          uid: b.customerUid || b.userId || newId,
          fullName: b.customer?.fullName || 'Expedition Guest',
          email: b.customer?.email || '',
          phone: b.customer?.phone || '',
          hasWhatsapp: true,
          memberSince: b.selectedDate || '2026-01-01',
          tier: 'Regular',
          contactLogs: [],
        };
        customerMap.set(emailKey, cust);
      }

      // Attach booking to history list
      if (!cust.bookings) cust.bookings = [];
      if (!cust.bookings.some((existingB) => existingB.bookingId === b.bookingId)) {
        cust.bookings.push(b);
      }
    });

    // 4. Calculate aggregated metrics for each customer
    const result: CustomerProfile[] = Array.from(customerMap.values()).map((cust) => {
      const bList = cust.bookings || [];
      const totalBookings = bList.length;
      const completedExpeditions = bList.filter(
        (b) => b.orderStatus === 'COMPLETED' || b.paymentStatus === 'PAID'
      ).length;
      const totalSpendLKR = bList.reduce((sum, b) => sum + (b.totalAmountLKR || 0), 0);

      // Auto-upgrade tier based on spend / bookings if still Regular
      let finalTier = cust.tier;
      if (finalTier === 'Regular') {
        if (totalSpendLKR >= 30000 || totalBookings >= 3) {
          finalTier = 'VIP';
        }
      }

      return {
        ...cust,
        tier: finalTier,
        totalBookings,
        completedExpeditions,
        totalSpendLKR,
      };
    });

    return result;
  } catch (err) {
    console.warn("getAllCustomersFromFirestore notice (fallback):", err);
    return inMemoryCustomers;
  }
}

/**
 * Fetch a single customer profile by ID, email, or UID.
 */
export async function getCustomerByIdFromFirestore(id: string): Promise<CustomerProfile | null> {
  if (!id) return null;
  const customers = await getAllCustomersFromFirestore();
  const found = customers.find(
    (c) =>
      c.id.toLowerCase() === id.toLowerCase() ||
      (c.uid && c.uid.toLowerCase() === id.toLowerCase()) ||
      c.email.toLowerCase() === id.toLowerCase()
  );
  return found || null;
}

/**
 * Save or update a Customer Profile in Firestore & local state.
 */
export async function saveCustomerProfileToFirestore(customer: CustomerProfile): Promise<CustomerProfile> {
  const index = inMemoryCustomers.findIndex(
    (c) => c.id === customer.id || c.email.toLowerCase() === customer.email.toLowerCase()
  );
  if (index >= 0) {
    inMemoryCustomers[index] = { ...inMemoryCustomers[index], ...customer };
  } else {
    inMemoryCustomers.push(customer);
  }

  try {
    const docId = customer.uid || customer.id;
    const userRef = doc(db, "users", docId);
    await setDoc(userRef, {
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      tier: customer.tier,
      dietaryPreferences: customer.dietaryPreferences || '',
      safetyNotes: customer.safetyNotes || '',
      emergencyContact: customer.emergencyContact || '',
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore save customer profile notice (stored locally):", err);
  }

  return customer;
}

/**
 * Add a concierge / contact interaction log to a customer profile.
 */
export async function addCustomerContactLogToFirestore(
  customerId: string,
  logData: Omit<CustomerContactLog, 'id' | 'createdAt'>
): Promise<CustomerContactLog> {
  const newLog: CustomerContactLog = {
    id: 'log-' + Date.now(),
    createdAt: new Date().toISOString(),
    author: logData.author || 'Staff Concierge',
    category: logData.category || 'Interaction',
    note: logData.note,
  };

  const target = inMemoryCustomers.find(
    (c) => c.id === customerId || c.uid === customerId || c.email.toLowerCase() === customerId.toLowerCase()
  );

  if (target) {
    if (!target.contactLogs) target.contactLogs = [];
    target.contactLogs.unshift(newLog);
  }

  try {
    const docRef = doc(db, "customers", customerId, "contactLogs", newLog.id);
    await setDoc(docRef, {
      ...newLog,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore add contact log notice (stored locally):", err);
  }

  return newLog;
}

/**
 * Toggle or update VIP / Tier status for a customer.
 */
export async function updateCustomerVIPStatus(
  customerId: string,
  tier: CustomerProfile['tier']
): Promise<boolean> {
  const target = inMemoryCustomers.find(
    (c) => c.id === customerId || c.uid === customerId || c.email.toLowerCase() === customerId.toLowerCase()
  );
  if (target) {
    target.tier = tier;
  }

  try {
    const userRef = doc(db, "users", customerId);
    await setDoc(userRef, { tier, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn("Firestore VIP tier update notice (updated locally):", err);
  }

  return true;
}

/* ==========================================================================
   CUSTOMER INQUIRIES MODULE (QA Report v1.1 Requirement)
   ========================================================================== */

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  staffNotes?: string;
  updatedAt?: string;
}

let inMemoryInquiries: CustomerInquiry[] = [
  {
    id: 'inq-101',
    name: 'Samanthi Perera',
    email: 'samanthi.p@example.com',
    phone: '+94778881122',
    subject: 'Sunset Kayaking Charter for Corporate Group of 12',
    message: 'Greetings Kalawewa Team! We are planning a corporate retreat for 12 executive guests on October 15th. Do you offer custom tandem kayak packages with private naturalist guides and evening sunset refreshments?',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    staffNotes: '',
  },
  {
    id: 'inq-102',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    phone: '+447911123456',
    subject: 'Wildlife Photography & Elephant Corridor Charter',
    message: 'Hello! I am a professional wildlife photographer traveling to Sri Lanka in late September. I would like to inquire about booking a dedicated single touring kayak with telephoto camera gear escort for early morning elephant viewing.',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(), // 1 day ago
    staffNotes: 'Saman (Front Desk) contacted guest via WhatsApp. Assigned Lead Naturalist Anura Bandara.',
  },
  {
    id: 'inq-103',
    name: 'Dilini Senaratne',
    email: 'dilini.s@example.com',
    phone: '+94713334455',
    subject: 'Lotus Drift Kayaking for Beginners',
    message: 'Hi, my partner and I have never kayaked before. Is the Sunrise Lotus Drift suitable for total beginners? Are life vests provided?',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    staffNotes: 'Confirmed life vest protocol & beginner safety briefing details via email. Guest completed booking KK-731940.',
  },
];

/**
 * Fetch all customer inquiries from Firestore `inquiries` collection,
 * falling back to in-memory cache if offline or uninitialized.
 */
export async function getAllInquiriesFromFirestore(): Promise<CustomerInquiry[]> {
  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const fetched: CustomerInquiry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          name: data.name || data.fullName || 'Guest Inquiry',
          email: data.email || '',
          phone: data.phone || '',
          subject: data.subject || 'General Inquiry',
          message: data.message || '',
          status: data.status || 'UNREAD',
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt.toString()) : new Date().toISOString(),
          staffNotes: data.staffNotes || '',
        });
      });

      // Merge with memory fallback if unique
      inMemoryInquiries.forEach((mem) => {
        if (!fetched.some((f) => f.id === mem.id || (f.email === mem.email && f.subject === mem.subject))) {
          fetched.push(mem);
        }
      });
      return fetched;
    }
  } catch (err) {
    console.warn("Firestore inquiries fetch notice (using memory fallback):", err);
  }
  return inMemoryInquiries;
}

/**
 * Update inquiry status or append staff notes in Firestore and memory.
 */
export async function updateInquiryStatusInFirestore(
  inquiryId: string,
  status: CustomerInquiry['status'],
  staffNotes?: string
): Promise<boolean> {
  const target = inMemoryInquiries.find((i) => i.id === inquiryId);
  if (target) {
    target.status = status;
    if (staffNotes !== undefined) target.staffNotes = staffNotes;
    target.updatedAt = new Date().toISOString();
  }

  try {
    const docRef = doc(db, "inquiries", inquiryId);
    await setDoc(docRef, {
      status,
      ...(staffNotes !== undefined && { staffNotes }),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore inquiry update notice (updated locally):", err);
  }

  return true;
}

/* ==========================================================================
   GENERAL SYSTEM SETTINGS MODULE (QA Report v1.1 Requirement)
   ========================================================================== */

export interface SystemSettings {
  operatingHours: {
    openingTime: string;
    closingTime: string;
    lastLaunchCutoff: string;
  };
  slotCapacities: {
    morningMaxGuests: number;
    eveningMaxGuests: number;
    maxKayaksPerSlot: number;
  };
  maintenance: {
    alertBannerEnabled: boolean;
    alertBannerMessage: string;
    blackoutBookingDates: string[];
  };
  contactDetails: {
    resortPhone: string;
    emergencyDeskPhone: string;
    notificationEmail: string;
  };
  currencyAndPayments: {
    baseCurrency: string;
    enabledPaymentMethods: ("COD" | "BANK_TRANSFER")[];
  };
}

let inMemoryGlobalSettings: SystemSettings = {
  operatingHours: {
    openingTime: '05:30 AM',
    closingTime: '06:30 PM',
    lastLaunchCutoff: '05:00 PM',
  },
  slotCapacities: {
    morningMaxGuests: 16,
    eveningMaxGuests: 16,
    maxKayaksPerSlot: 12,
  },
  maintenance: {
    alertBannerEnabled: false,
    alertBannerMessage: 'High Water Release Notice: Spillway discharge active between 10:00 AM - 02:00 PM. Expeditions operating on modified shoreline routes.',
    blackoutBookingDates: [],
  },
  contactDetails: {
    resortPhone: '+94 77 123 4567',
    emergencyDeskPhone: '+94 71 987 6543',
    notificationEmail: 'reservations@kalawewakayaking.com',
  },
  currencyAndPayments: {
    baseCurrency: 'LKR',
    enabledPaymentMethods: ['COD', 'BANK_TRANSFER'],
  },
};

/**
 * Fetch global system configurations from Firestore `system_settings/global`.
 */
export async function getGlobalSettingsFromFirestore(): Promise<SystemSettings> {
  try {
    const docRef = doc(db, "system_settings", "global");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SystemSettings;
      inMemoryGlobalSettings = { ...inMemoryGlobalSettings, ...data };
      return inMemoryGlobalSettings;
    }
  } catch (err) {
    console.warn("Firestore system settings fetch notice (using memory fallback):", err);
  }
  return inMemoryGlobalSettings;
}

/**
 * Save updated system configurations to Firestore `system_settings/global`.
 */
export async function saveGlobalSettingsToFirestore(settings: SystemSettings): Promise<SystemSettings> {
  inMemoryGlobalSettings = { ...settings };
  try {
    const docRef = doc(db, "system_settings", "global");
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore system settings save notice (saved locally):", err);
  }
  return inMemoryGlobalSettings;
}





