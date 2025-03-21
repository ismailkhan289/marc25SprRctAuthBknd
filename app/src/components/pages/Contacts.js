import React from 'react';
import { useEffect, useState } from 'react';

const Contacts = () => {
    
    
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch('api/contacts');
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);
    if (loading) {
        return <p> Fetching Conacts Loading...</p>;
    }   
    return (
        <div>
            <h1>Contacts Page</h1>
            {contacts}
            <p>This is the Contacts page.</p>
        </div>
    );
};

export default Contacts;