import { useState, useEffect } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateCategory, CheckDuplicate } from "../services/Productsservices";
import { Dropdown } from 'primereact/dropdown';

export default function AddCategoryModal({ show, fetchcategoriescolumn, updatecategory, editCategory, category, onCancel }) {

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({
    type: null,
    message: null
  });

  function objectToFormData(obj, form = new FormData(), namespace = '') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const formKey = namespace ? `${namespace}[${key}]` : key;
        const value = obj[key];

        if (value instanceof Date) {
          form.append(formKey, value.toISOString());
        } else if (value instanceof File || value instanceof Blob) {
          form.append(formKey, value);
        } else if (typeof value === 'object' && value !== null) {
          objectToFormData(value, form, formKey); // recurse
        } else {
          form.append(formKey, value ?? ''); // convert null to empty string
        }
      }
    }
    return form;
  }

  const initialValues = {
    cat_id: '',
    category: '',
    status: 1,
  }
  // Formik initialization
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      category: Yup.string()
        .required("Category Name is required")
        .test(
          'CheckDuplicate',
          'Category already exists',
          async function (value) {
            if (!value) return true;
            const values = {
              value: value,
              cat_id: category?.cat_id ?? 0
            }
            try {
              const res = await CheckDuplicate(objectToFormData(values));
              return !res.status; // return false to trigger error
            } catch (e) {
              return this.createError({ message: 'Server error' });
            }
          }
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true)
        const formData = objectToFormData(values);
        const data = await CreateCategory(formData);
        if (data.status) {
          fetchcategoriescolumn()
          updatecategory(data.cat_id)
          setMsg({
            type: 'success',
            message: data.message,
          })
          resetForm();
        } else {
          setMsg({
            type: 'fail',
            message: data.message
          })
        }
      } catch (error) {
        setMsg({
          type: 'fail',
          message: error.message || "An error occurred."
        })
      } finally {
        setSubmitting(false)
      }
    },
  });

  useEffect(() => {
    if (editCategory && category) {
      const { cat_id, category, status } = category;
      formik.setValues({
        cat_id: cat_id ?? '',
        category: category ?? '',
        status: parseInt(status) ?? 1,
      })
    } else {
      formik.setValues(initialValues)
    }
  }, [editCategory])

  const status = [{
    label: 'Yes',
    value: 1
  }, {
    label: 'No',
    value: 0
  }]

  const onClose = () => {
    onCancel();
    setSubmitting(false);
    setMsg({
      type: null,
      message: null
    });
    formik.resetForm();
  };

  return (
    <div
      className={`dfc-modal modal fade ${show ? "show d-flex" : ""}`}
      id="AddCategoryModal"
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={formik.handleSubmit}>
          <div className="modal-header">
            <h4 className="modal-title">Add Category</h4>
          </div>

          <div className="modal-body">
            {msg.type === 'success' ? <div className="alert alert-success" role="alert">{msg.message}</div>
              : <>
                <input type='hidden' name='cat_id' value={formik.values.cat_id} />
                <div className='d-flex justify-content-between align-items-start gap-2'>
                  <div className="form-group">
                    <label htmlFor="category">Category Name</label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      className="form-control small"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.category && formik.errors.category ? (
                      <div className="input-error">{formik.errors.category}</div>
                    ) : null}
                  </div>
                  <div className='form-group' style={{ width: 115 }}>
                    <label htmlFor='status' className='text-xs'>Status</label>
                    <Dropdown
                      id='status'
                      name="status"
                      value={formik.values.status}
                      options={status}
                      onChange={formik.handleChange}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select Status"
                      className="form-control small"
                    />
                    {formik.touched.status && formik.errors.status ? (
                      <div className="input-error">{formik.errors.status}</div>
                    ) : null}
                  </div>
                </div>
              </>}
          </div>

          <div className="modal-footer">
            {msg.type === 'success' ?
              <button type='button' className="btn" onClick={() => onClose()}>
                {"OK"}
              </button>
              : <>
                {msg.type === 'fail' && <div className="alert alert-danger" role="alert">{msg.message}</div>}
                <button type='button' className="btn btn-secondary" onClick={() => onClose()}>
                  {"Cancel"}
                </button>
                <button type="submit" className="btn">
                  {editCategory ? "Update" : "Submit"}
                </button>
              </>}
          </div>
        </form>
      </div>
    </div>
  );
};