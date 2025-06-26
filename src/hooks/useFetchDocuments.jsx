import { useEffect, useState } from "react"
import { db } from '../firebase/config'
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (cancelled) return;

            setLoading(true)

            const collectionRef = await collection(db, docCollection)

            try {
                let q;

                if (search) {
                    q = await query(collectionRef, where('tagsArray', 'array-contains', search), orderBy('createdAt', 'desc'));
                } else if (uid) {
                    q = await query(collectionRef, where('uid', '==', uid), orderBy('createdAt', 'desc'));
                } else {
                    q = await query(collectionRef, orderBy('createdAt', 'desc'));
                }

                await onSnapshot(q, (querySnapshot) => {
                    setDocuments(
                        querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    )
                })

                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(e.message);

                setLoading(false);
            }
        }
        loadData();
    }, [docCollection, search, uid, cancelled])

    useEffect(() => {
        return () => setCancelled(true)
    }, []);

    return { documents, loading, error };
}
