import { useEffect, useState } from "react"
import { db } from '../firebase/config'
import { doc, getDoc } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
    const [document, setDocument] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        const loadDoc = async () => {
            if (cancelled) return;

            setLoading(true)

            try {
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);

                setDocument(docSnap.data());
                
                setLoading(false);
            } catch (error) {
                console.log(error)
                setError(error.message)
                setLoading(false);
            }
        }
        loadDoc();
    }, [docCollection, id, cancelled])

    useEffect(() => {
        return () => setCancelled(true)
    }, []);

    return { document, loading, error };
}
