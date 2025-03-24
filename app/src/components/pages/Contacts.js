import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input,Row, Col, Badge, CardText, Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
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
        //send a POST request to the server
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
        //parse the response
        .then(response => response.json())
        .then(data => {
            setContacts([...contacts, data]);
            setNewContact(initialNewContactValues);
            toggle();
        })
        .catch(error => console.error('Error adding contact:', error));
    }
    // Function to fetch contact details & open modal
  const toggleAndFetch = async (event,id) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/contact/${id}`);
      if (!response.ok) throw new Error("Failed to fetch contact");
      const data = await response.json();
      setNewContact(data);  // ✅ Store fetched contact
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
      setModal(true);  // ✅ Open modal
    }
  }
    const myContactEditUpdate = async (event, id) => {
        event.preventDefault();
        //send a PUT request to the server
        await fetch(`api/contact/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken() // ✅ CSRF Token Add
            },
            credentials: 'include',
            body: JSON.stringify(newContact)
        })
        //parse the response
        .then(response => response.json())
        .then(data => {
            setContacts(contacts.map(contact => contact.id === data.id ? data : contact));
            setNewContact(initialNewContactValues);
            toggle();
        }) 
        .catch(error => console.error('Error updating contact:', error));
    }
    const handleCancel = () => {
        setNewContact(initialNewContactValues);
        toggle();
    };
    const ContactCard=({myContact})=>{
        return(
        <Card className="d-flex flex-row shadow-sm border-0 rounded" style={{ maxWidth: "500px", backgroundColor: "#f5f5dc"}} onClick={(event) => toggleAndFetch(event, myContact.id)}>
        {/* Left Section with Image & Badges */}
        <div className="d-flex flex-column align-items-center justify-content-center p-3" style={{ backgroundColor: "#b5c7b3", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
          {/* Profile Image */}
          <img
            src={"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"}
            alt="Profile"
            className="rounded-circle mb-2"
            style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid white" }}
          />
      
          {/* Badges */}
          <Badge color="secondary" className="mb-2">LEVEL {myContact.status}</Badge>
          <Badge color="success">{myContact.title} POINTS</Badge>
        </div>
      
        {/* Right Section with Details */}
        <CardBody style={{ backgroundColor: "white", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
          <CardTitle className="h4 fw-bold">{myContact.name}</CardTitle>
          <CardText className="text-muted">
            {myContact.email || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a volutpat mauris."}
          </CardText>
          <small className="text-muted">{myContact.address}</small>
          {/* Buttons */}
            <div className="d-flex justify-content-end align-items-center">
            <Button color="primary" size="sm" className='me-2'>View Profile</Button>
            <Button color="danger" size="sm">Delete</Button>
            </div>
        </CardBody>
          </Card>
        )
    };

    
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
                <Button style={{ width:'10%'}} color="primary" onClick={toggle}>Add Contact</Button>
                {contacts ? (
                <p>{contacts.length > 0 ? (contacts.length === 1 ? `No of Contact: ${contacts.length}` : `No of Contacts: ${contacts.length}`) : ""}</p>
                ) : (
                <p>No contacts available</p>
                )}
            </div>
            <Row className="d-flex justify-content-between mt-4 g-4">
                {contacts===null ? (
                "") : (
                contacts.map((contact, index) => (
                    <ContactCard key={index} myContact={contact} myContactEditUpdate={myContactEditUpdate} />
                ))
                )}
            </Row>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{newContact.id ? 'Update Contact' : 'Add New Contact'}</ModalHeader>
                <ModalBody>
                <Form>
                    <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={newContact.name} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" value={newContact.email} onChange={handleChange} required/>
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
                <Button color="primary" onClick={newContact.id ? (e) => myContactEditUpdate(e, newContact.id) : handleSubmit}>{newContact.id ? 'Update' : 'Submit'}</Button>{' '}
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
            </div>
        );
    };

    export default Contacts;
        