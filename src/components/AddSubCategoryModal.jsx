import { useState, useEffect } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateSubCategory, CheckSubDuplicate } from "../services/Productsservices";
import { Dropdown } from 'primereact/dropdown';
import { set } from 'date-fns';

export default function AddSubCategoryModal({ show, fetchcategoriescolumn, updatecategory, editCategory, category, parentCategory, onCancel }) {

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
    scat_id: '',
    cat_id: parentCategory?.cat_id ?? '',
    scategory: '',
    status: 1,
  }
  // Formik initialization
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      scategory: Yup.string()
        .required("Sub Category Name is required")
        .test(
          'CheckDuplicate',
          'Sub Category already exists',
          async function (value) {
            if (!value) return true;
            const values = {
              value: value,
              scat_id: category?.scat_id ?? 0
            }
            try {
              const res = await CheckSubDuplicate(objectToFormData(values));
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
        const data = await CreateSubCategory(formData);
        if (data.status) {
          fetchcategoriescolumn(parentCategory?.cat_id)
          updatecategory(data.scat_id)
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
      const { scat_id, cat_id, scategory, status } = category;
      formik.setValues({
        scat_id: scat_id ?? '',
        cat_id: cat_id ?? '',
        scategory: scategory ?? '',
        status: parseInt(status) ?? 1,
      })
    } else {
      formik.setValues(initialValues)
    }
  }, [editCategory])

  useEffect(() => {
    if (parentCategory) {
      formik.setFieldValue('cat_id', parentCategory?.cat_id)
    }
  }, [parentCategory])

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
      id="AddSubCategoryModal"
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={formik.handleSubmit}>
          <div className="modal-header">
            <h4 className="modal-title">Add Sub Category <small>for</small> <small style={{ color: '#f68b09' }}>"{parentCategory?.category}"</small></h4>
          </div>

          <div className="modal-body">
            {msg.type === 'success' ? <div className="alert alert-success" role="alert">{msg.message}</div>
              : <>
                <input type='hidden' name='scat_id' value={formik.values.scat_id} />
                <input type='hidden' name='cat_id' value={formik.values.cat_id || ''} />
                <div className='d-flex justify-content-between align-items-start gap-2'>
                  <div className="form-group">
                    <label htmlFor="scategory">Sub Category Name</label>
                    <input
                      id="scategory"
                      name="scategory"
                      type="text"
                      className="form-control small"
                      value={formik.values.scategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.scategory && formik.errors.scategory ? (
                      <div className="input-error">{formik.errors.scategory}</div>
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