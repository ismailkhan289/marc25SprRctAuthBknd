import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useParams } from 'react-router-dom';
    
    const Contacts = () => {
        const [contacts, setContacts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [modal, setModal] = useState(false);
        const {id} = useParams();   
        const initialNewContactValues= {
            name: '',
            email: '',
            title: '',
            status: '',
            address: ''
        };
        
        
        const [newContact, setNewContact] = useState(initialNewContactValues);
        
        const toggle = () => setModal(!modal);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setNewContact({ ...newContact, [name]: value });
        };

        const getCsrfToken = () => {
         return document.cookie.split(';').find(row=>row.startsWith('XSRF-TOKEN')).split('=')[1] || '';
        }
      const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch('api/contact', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken() // ✅ CSRF Token Add
            },
            credentials: 'include',
            body: JSON.stringify(newContact)
        })
        .then(response => response.json())
        .then(data => {
            setContacts([...contacts, data]);
            setNewContact(initialNewContactValues);
            toggle();
        })
        .catch(error => console.error('Error adding contact:', error));
    }
        // const handleSubmit = async () => {
        //     const url =`api/contact`;
        //     // const url = newContact.id ? `api/contacts/${newContact.id}` : 'api/contacts';
        //     const method = newContact.id ? 'PUT' : 'POST';
        //     const headers = {
        //     'Content-Type': 'application/json',
        //     'Accept':'application/json' // Replace with your actual auth token
        //     };
        //     // const credientials = 'include';
        //     try {
        //     const response = await fetch(url, {
        //         method: method,
        //         headers: headers,
        //         credentials: 'include',
                
        //         body: JSON.stringify(newContact)
        //     });

        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }

        //     const savedContact = await response.json();

        //     if (method === 'POST') {
        //         setContacts([...contacts, savedContact]);
        //     } else {
        //         setContacts(contacts.map(contact => contact.id === savedContact.id ? savedContact : contact));
        //     }

        //     setNewContact(initialNewContactValues);
        //     toggle();
        //     } catch (error) {
        //     console.error('Error saving contact:', error);
        //     }
        // };

        //fetching contacts
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
            return <p>Fetching Contacts Loading...</p>;
        }

        return (
            <div className='container'>
            <div className='row' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <h1 style={{ margin: 0, marginRight: 'auto', width:'40%' }}>Contacts Page</h1>
                <Button style={{ width:'10%'}}color="primary" onClick={toggle}>Add Contact</Button>
            </div>
            {contacts?.length ? contacts.map(contact => <div key={contact.id}>{contact.name}</div>) : 'No Contacts'}
            <p>This is the Contacts page.</p>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add New Contact</ModalHeader>
                <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={newContact.name} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" value={newContact.email} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" value={newContact.title} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="status">Status</Label>
                        <Input type="text" name="status" id="status" value={newContact.status} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" id="address" value={newContact.address} onChange={handleChange} />
                    </FormGroup>
                </Form>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            </div>
        );
    };

    export default Contacts;
        