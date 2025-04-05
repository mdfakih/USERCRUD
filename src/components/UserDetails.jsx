import { Link, useParams, useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { getSingleUser, updateUser, deleteUser } from '../services/crudApis';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UserDetails.css';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const deleteDialogRef = useRef();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getSingleUser(id);
        const data = response?.data;
        setUser(data);
        setFormData({
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          gender: data?.gender || '',
          //   birthDate: data?.birthDate?.split('T')[0] || '',
          birthDate: new Date(data?.birthDate).toISOString().slice(0, 10) || '',
        });
      } catch (err) {
        console.log(err);
        toast.error('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, gender, birthDate } = formData;
    if (!firstName || !lastName || !email || !gender || !birthDate) {
      toast.error('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email.');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await updateUser(id, formData);
      setUser(response.data);
      setEditing(false);
      toast.success('User updated successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = () => {
    deleteDialogRef.current?.showModal();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      deleteDialogRef.current?.close();
      navigate('/');
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="user-details-container">
        <h1>Loading...</h1>
      </div>
    );
  if (!user)
    return (
      <div className="user-details-container">
        <h1>User not found</h1>
      </div>
    );

  return (
    <div className="user-details-container">
      <h1>User Details</h1>
      <ToastContainer position="top-right" />

      {editing ? (
        <div className="user-details-form">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
          <div className="button-group">
            <button
              className="btn btn-save"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Birth Date:</strong>{' '}
            {new Date(user.birthDate).toLocaleDateString('en-GB')}
          </p>
          <div
            className="button-group"
            style={{ marginTop: '1rem' }}
          >
            <button
              className="btn btn-edit"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={openDeleteDialog}
            >
              Delete
            </button>
          </div>
        </>
      )}

      <Link to="/">
        <button className="btn btn-back">Go Back</button>
      </Link>

      <dialog
        ref={deleteDialogRef}
        className="modal"
      >
        <h3>Are you sure you want to delete this user?</h3>
        <div
          className="button-group"
          style={{ marginTop: '1rem' }}
        >
          <button
            className="btn btn-delete"
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => deleteDialogRef.current.close()}
            disabled={deleting}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default UserDetails;
