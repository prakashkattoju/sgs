import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { decodeToken } from 'react-jwt';
import { UpdateUserDetails } from '../services/Userservices';
import { FaSpinner } from 'react-icons/fa';
import Header from '../components/Header';
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const validationSchema = Yup.object({
  fullname: Yup.string().required('Full Name is required'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Mobile number'),
});

function EditUserDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);
  const decodedToken = decodeToken(token);
  const user_id = decodedToken?.user_id;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const headerRef = useRef(null);
  const [height, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: user_id || '',
      mobile: user.mobile || '',
      fullname: user.fullname || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = await UpdateUserDetails(values);
        if (data.status) {
          dispatch(setUserDetails({
            fullname: values.fullname,
            mobile: values.mobile,
          }));
          navigate('/account', { replace: true, state: { saved: true } });
        }
      } catch (error) {
        console.error('Failed to update user details:', error);
        setErrorMsg(error.message || 'Failed to update user details');
      } finally {
        setLoading(false);
      }
    },
  });

  const f = formik;

  return (<>
    <Header headerRef={headerRef} title={user.mobile === '1143' ? 'Siri General Stores' : user.fullname ? user.fullname : 'User'} subtitle="Edit your details" />
    <main className='site-main'>
      <div className='items-container search-items-container'>
        <div style={{ height: `calc(100dvh - ${height + 2}px)` }} className="list scroll">
          <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
            <div className={`item-list orders-list`}>
              {/* Form Card */}
              <form className="card" onSubmit={f.handleSubmit} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Fields */}
                <div style={{ padding: '18px 18px 6px' }}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <div className="form-group">
                      <input
                        name="fullname"
                        placeholder="Enter your full name"
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control"
                      />
                      {formik.touched.fullname && formik.errors.fullname ? (
                        <div className="input-error">{formik.errors.fullname}</div>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Mobile Number</label>
                    <div className="form-group">
                      <input
                        name="mobile"
                        placeholder="Enter 10-digit WhatsApp number"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control"
                      />
                      {formik.touched.mobile && formik.errors.mobile ? (
                        <div className="input-error">{formik.errors.mobile}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                {errorMsg && <div style={{ padding: '10px 18px 0', display: 'flex', gap: 10, color: 'red'}} className="error-message">{errorMsg}</div>}
                <div style={{ padding: '18px', display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/account')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                    disabled={loading}
                  >
                    {loading && <FaSpinner className="animate-spin" />}
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </main>
  </>
  );
}

export default EditUserDetails;
