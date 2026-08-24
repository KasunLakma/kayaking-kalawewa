import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

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
