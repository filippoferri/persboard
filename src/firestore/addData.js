import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from './configFirestore';

import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default async function addData(colllection, id, data) {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db, colllection, id), data, {
            merge: true,
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}