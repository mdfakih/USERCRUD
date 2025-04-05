import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CreateUserPage.css';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { firstName, lastName, age, email } = formData;

    if (!firstName || firstName.length < 2) {
      toast.error('First name must be at least 2 characters long');
      return false;
    }

    if (!lastName || lastName.length < 2) {
      toast.error('Last name must be at least 2 characters long');
      return false;
    }

    const ageNumber = parseInt(age);
    if (!ageNumber || ageNumber < 1 || ageNumber > 150) {
      toast.error('Enter a valid age');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post('https://dummyjson.com/users/add', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: Number(formData.age),
        email: formData.email,
      });

      console.log(res.data);
      toast.success('User created successfully!');
      setFormData({ firstName: '', lastName: '', age: '', email: '' });
      setLoading(false);

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="create-user-container">
      <h2>Create New User</h2>
      <form
        onSubmit={handleSubmit}
        className="create-user-form"
      >
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading ? <span className="loader" /> : 'Create User'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
        >
          Go Back
        </button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </div>
  );
};

export default CreateUserPage;
