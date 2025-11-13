'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write', // or 'create'/'update' based on options
        requestResourceData: data,
      })
    )
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation.
 * Can work with either a CollectionReference (to auto-generate an ID)
 * or a DocumentReference (to use a custom ID).
 * Does NOT await the write operation internally.
 */
export function addDocumentNonBlocking(
  ref: CollectionReference | DocumentReference,
  data: any
) {
  let promise;
  if (ref.type === 'collection') {
    // If it's a collection, use addDoc to auto-generate ID
    promise = addDoc(ref, data).catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: ref.path,
          operation: 'create',
          requestResourceData: data,
        })
      );
    });
  } else {
    // If it's a document reference, use setDoc to create with a specific ID
    promise = setDoc(ref, data).catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: ref.path,
          operation: 'create',
          requestResourceData: data,
        })
      );
    });
  }
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
