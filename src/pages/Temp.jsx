import { useState, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetAllItems, GetColumns, CreateItem, DeleteItemByID } from '../services/Dashboardservices';
import { GetOnlyCategories, GetSubCategories } from '../services/Productsservices';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';
import Pagination from '../components/Pagination';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from "primereact/autocomplete";
import { FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import priceDisplay from '../util/priceDisplay';
import { format, set } from 'date-fns'
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import AddCategoryModal from '../components/AddCategoryModal';
import AddSubCategoryModal from '../components/AddSubCategoryModal';

export default function Temp() {
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate();
    const { list } = useParams();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [packings, setPackings] = useState([])
    const [filteredPackingsColumn, setFilteredPackingsColumn] = useState([])

    const [company, setCompany] = useState([])
    const [filteredCompanyColumn, setFilteredCompanyColumn] = useState([])

    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])

    const [page, setPage] = useState(list);
    const [limit, setLimit] = useState(500);
    const [total, setTotal] = useState(0);
    const [query, setQuery] = useState("");

    const [items, setItems] = useState([])
    const [editItem, setEditItem] = useState(false);
    const [itemData, setItemData] = useState({});

    const user = useSelector((state) => state.user);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [itemDeleteConfirm, setItemDeleteConfirm] = useState({
        status: false,
        item_id: null,
        item_name: null
    });

    const [showAlert, setShowAlert] = useState({
        title: null,
        message: null,
        show: false
    });

    const [addCategoryModal, setAddCategoryModal] = useState(false)
    const [editCategory, setEditCategory] = useState(false)
    const [category, setCategory] = useState({})

    const [addSubCategoryModal, setAddSubCategoryModal] = useState(false)
    const [editSubCategory, setEditSubCategory] = useState(false)
    const [subCategory, setSubCategory] = useState({})
    const [parentCategory, setParentCategory] = useState({})

    const headerRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);

    const [editStatus, setEditStatus] = useState(0)
    const [filteredData, setFilteredData] = useState([]);
    const [complete, setComplete] = useState(0)
    const [pending, setPending] = useState(0)


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


    const fetchpackingscolumn = useCallback(async () => {
        try {
            const data = await GetColumns('unit');
            setPackings(data);
        } catch (error) {
            console.error("Failed to fetch packings data:", error);
        }
    }, []);

    const fetchcompanycolumn = useCallback(async () => {
        try {
            const data = await GetColumns('company');
            setCompany(data);
        } catch (error) {
            console.error("Failed to fetch company data:", error);
        }
    }, []);

    const fetchcategoriescolumn = useCallback(async () => {
        try {
            const data = await GetOnlyCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories data:", error);
        }
    }, []);

    const fetchsubcategoriescolumn = useCallback(async (cat_id) => {
        try {
            const data = await GetSubCategories(cat_id);
            setSubcategories(data);
        } catch (error) {
            console.error("Failed to fetch categories data:", error);
        }
    }, []);

    const ItemDeleteHandle = async (item_id) => {
        try {
            const data = await DeleteItemByID(item_id);
            if (data.status) {
                setItemDeleteConfirm({
                    status: false,
                    item_id: null,
                    item_name: null
                })
                setShowAlert({
                    title: 'Delete',
                    message: data.message,
                    show: true
                })
                fetchpackingscolumn()
                fetchcompanycolumn()
                fetchItems()
            }
        } catch (error) {
            console.error(error.message || "An error occurred.")
        } /* finally {
            setEditClient(false)
            setViewClient(false)
            setClientData(initialValues)
            setDocuments([])
        } */
    }

    const fetchItems = useCallback(async () => {

        const searchData = query !== "" ? { page: page, limit: limit, search: query } : { page: page, limit: limit }

        try {
            setLoading(true)
            const res = await GetAllItems(searchData);
            setItems(res.data || []);
            setTotal(res.total);
            setPending(res.pending)
            setComplete(res.complete)
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false)
        }
    }, [page, limit, query]);

    useEffect(() => {
        fetchpackingscolumn()
        fetchcompanycolumn()
        fetchcategoriescolumn()
        const timer = setTimeout(() => {
            fetchItems()

        }, 400);
        return () => clearTimeout(timer);
    }, [fetchItems, fetchpackingscolumn, fetchcompanycolumn, fetchcategoriescolumn, page, limit, query]);


    const packingscolumnSearch = (event) => {
        const query = event.query.toLowerCase();
        let results = packings?.filter((item) =>
            item.toLowerCase().includes(query)
        );
        setFilteredPackingsColumn(results);
    };

    const companycolumnSearch = (event) => {
        const query = event.query.toLowerCase();
        let results = company?.filter((item) =>
            item.toLowerCase().includes(query)
        );
        setFilteredCompanyColumn(results);
    };

    const handleCategoryDropdownChange = (cat_id) => {
        formik.setFieldValue('cat_id', cat_id);
        fetchsubcategoriescolumn(cat_id)
        const pcat = categories.find(item => item.cat_id === cat_id);
        if (pcat) {
            setParentCategory(pcat);
        }
    };

    const handleSubCategoryDropdownChange = (scat_id) => {
        formik.setFieldValue('scat_id', scat_id);
    };

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
        item_id: '',
        cat_id: '',
        scat_id: '',
        company: '',
        item: '',
        unit: '',
        price: '',
        status: 1,
    }
    // Formik initialization
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            item: Yup.string()
                .required("Item Name is required"),
            cat_id: Yup.number()
                .required('Category is required') // Basic required validation
                .test(
                    'not-zero', // Name of the test
                    'Select Category', // Error message
                    value => value !== 0 // The validation logic
                ),
            scat_id: Yup.number()
                .required('Sub Category is required') // Basic required validation
                .test(
                    'not-zero', // Name of the test
                    'Select Sub Category', // Error message
                    value => value !== 0 // The validation logic
                ),
            unit: Yup.string()
                .required("Packing is required"),
            price: Yup.string()
                .required("Price is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                setSubmitting(true)
                const formData = objectToFormData(values);
                const data = await CreateItem(formData);
                if (data.status) {
                    setShowAlert({
                        title: 'Success',
                        message: data.message,
                        show: true
                    })
                    if (editItem) {
                        setEditItem(false)
                        setItemData({})
                    }
                    resetForm();
                    fetchpackingscolumn()
                    fetchcompanycolumn()
                    fetchItems()
                } else {
                    setShowAlert({
                        title: 'Fail',
                        message: data.message,
                        show: true
                    })
                }
            } catch (error) {
                setShowAlert({
                    title: 'Error',
                    message: error.message || "An error occurred.",
                    show: true
                })
            } finally {
                setSubmitting(false)
            }
        },
    });

    useEffect(() => {
        if (editItem && itemData) {
            const { item_id, cat_id, scat_id, company, item, unit, price, status } = itemData;
            formik.setValues({
                item_id: item_id ?? '',
                cat_id: cat_id ?? '',
                scat_id: scat_id ?? '',
                company: company ?? '',
                item: item ?? '',
                unit: unit ?? '',
                price: price ?? '',
                status: parseInt(status) ?? 1,
            })
        } else {
            formik.setValues(initialValues)
        }
    }, [itemData, editItem])

    useEffect(() => {
        const result = items.filter(item => item.editstatus == editStatus);
        setFilteredData(result);

        const pendingresults = items.filter(item => item.editstatus == 0);
        setPending(pendingresults.length)

        const completeresults = items.filter(item => item.editstatus == 1);
        setComplete(completeresults.length)

    }, [items, editStatus]);

    const handleEditItem = (record) => {
        setEditItem(true)
        setItemData(record)
        handleCategoryDropdownChange(record.cat_id)
    }


    const logoutAccount = () => {
        dispatch(logOut()); // Dispatch the logout action to clear user state
        dispatch(setUserDetails({
            fullname: null,
            mobile: null
        }))
        navigate("/", { replace: true }); // Redirect the user to the login page after logging out
        window.location.reload(true);
    };

    const handleCancel = () => {
        document.activeElement?.blur();
        setShowLogoutConfirm(false);
        setItemDeleteConfirm({
            status: false,
            item_id: null,
            item_name: null
        });
    };

    const handleFormCancel = () => {
        setEditItem(false)
        setItemData(initialValues)
        formik.resetForm();
    }

    const status = [{
        label: 'Active',
        value: 1
    }, {
        label: 'Inactive',
        value: 0
    }]

    return (
        <>
            <header ref={headerRef} className="site-header">
                <div className='search-area d-flex gap-3 align-items-center justify-content-center'>
                    <img className="logo" src='/icon.jpg' alt='' />
                    <div className="search-form d-flex gap-3 align-items-center justify-content-start">
                        <div className="form-group">
                            <input className="form-control alt" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                            <span className='search-icon'><i className="fa-solid fa-search"></i></span>
                        </div>
                    </div>
                </div>
            </header>
            <main className='site-main'>
                {editItem ? <form onSubmit={formik.handleSubmit} style={{ padding: 15, height: `calc(100dvh - ${(height)}px)` }}>
                    <input type='hidden' name='item_id' value={formik.values.item_id} />
                    <div className='d-flex flex-column justify-content-center align-items-strecth gap-1'>
                        <div className='relative'>
                            <label htmlFor='item' className='text-xs'>Item Name</label>
                            <input id='item' name="item" type="text" className="form-control small" value={formik.values.item} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {formik.touched.item && formik.errors.item ? (
                                <div className="input-error">{formik.errors.item}</div>
                            ) : null}
                        </div>
                        <div className='relative'>
                            <label htmlFor='company' className='text-xs'>Company</label>
                            <AutoComplete
                                id='company'
                                value={formik.values.company}
                                suggestions={filteredCompanyColumn}
                                completeMethod={companycolumnSearch}
                                placeholder="Select or enter company"
                                dropdown
                                onChange={(e) => formik.setFieldValue("company", e.value)}
                                className="form-control small"
                            />
                        </div>
                        <div className='relative'>
                            <label htmlFor='cat_id' className='text-xs'>Category <small>| <span onClick={() => setAddCategoryModal(true)} style={{ color: '#f68b09', cursor: 'pointer' }}>Add New</span></small></label>
                            <Dropdown
                                id='cat_id'
                                name="cat_id"
                                value={formik.values.cat_id}
                                options={categories}
                                onChange={(e) => handleCategoryDropdownChange(e.value)}
                                filter
                                filterBy="category"
                                filterMatchMode="startsWith"
                                optionLabel="category"
                                optionValue="cat_id"
                                showClear
                                placeholder="Select Category"
                                className="form-control small"
                            />
                            {formik.touched.cat_id && formik.errors.cat_id ? (
                                <div className="input-error">{formik.errors.cat_id}</div>
                            ) : null}
                        </div>
                        <div className='relative'>
                            <label htmlFor='scat_id' className='text-xs'>Sub Category {formik.values.cat_id && <small>| <span onClick={() => setAddSubCategoryModal(true)} style={{ color: '#f68b09', cursor: 'pointer' }}>Add New</span></small>}</label>
                            <Dropdown
                                id='scat_id'
                                name="scat_id"
                                value={formik.values.scat_id}
                                options={subcategories}
                                onChange={(e) => handleSubCategoryDropdownChange(e.value)}
                                filter
                                filterBy="scategory"
                                filterMatchMode="startsWith"
                                optionLabel="scategory"
                                optionValue="scat_id"
                                showClear
                                placeholder="Select Sub Category"
                                className="form-control small"
                                disabled={!formik.values.cat_id}
                            />
                            {formik.touched.scat_id && formik.errors.scat_id ? (
                                <div className="input-error">{formik.errors.scat_id}</div>
                            ) : null}
                        </div>
                        <div className='d-flex justify-content-between align-items-start gap-1'>
                            <div className='relative' style={{ width: 'calc(100% - 90px)' }}>
                                <label htmlFor='unit' className='text-xs'>Packing</label>
                                <AutoComplete
                                    id='unit'
                                    value={formik.values.unit}
                                    suggestions={filteredPackingsColumn}
                                    completeMethod={packingscolumnSearch}
                                    placeholder="Select or enter packing"
                                    dropdown
                                    onChange={(e) => formik.setFieldValue("unit", e.value)}
                                    className="form-control small"
                                />
                                {formik.touched.unit && formik.errors.unit ? (
                                    <div className="input-error">{formik.errors.unit}</div>
                                ) : null}
                            </div>
                            <div className='relative' style={{ width: 90 }}>
                                <label htmlFor='price' className='text-xs'>Price</label>
                                <input id='price' name="price" type="text" className="form-control small" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                {formik.touched.price && formik.errors.price ? (
                                    <div className="input-error">{formik.errors.price}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className='d-flex justify-content-between align-items-end gap-1'>
                            <div className='relative' style={{ width: '33%' }}>
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

                            <div className='relative form-group' style={{ width: '33%' }}>
                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ width: '100%' }}
                                >{submitting && <FaSpinner className="animate-spin" />} {'Submit'}
                                </button>
                            </div>
                            <div className='relative form-group' style={{ width: '33%' }}>
                                <button
                                    onClick={handleFormCancel}
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ width: '100%' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form> :
                    <div style={{ height: `calc(100dvh - ${(height)}px)` }} className='items-list'>
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                            <div className='items-list-inner'>
                                <table className="table table-bordered mb-3">
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#f2f2f2', color: '#000', textAlign: 'left' }}>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <label>Items</label>
                                                    <div className='d-flex justify-content-between align-items-center gap-1'>
                                                        <button onClick={() => setEditStatus(0)} className={`icon-btn-cart small del ${editStatus === 0 ? 'active' : ''}`}>Pending ({pending})</button>
                                                        <button onClick={() => setEditStatus(1)} className={`icon-btn-cart small add ${editStatus === 1 ? 'active' : ''}`}>Completed ({complete})</button>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? <tr><td>Loading items...</td></tr> : filteredData.length > 0 ? filteredData?.map((item) => {
                                            return (<tr key={item.item_id} className={item.item_id === itemData?.item_id ? 'active' : ''}>
                                                <td>
                                                    <div className='d-flex justify-content-between align-items-center gap-1'>
                                                        <div>{item.item}<small><br />Packing: {item.unit}&nbsp;&nbsp;&middot;&nbsp;&nbsp;Price: {item.price}<br/ >{item.category && item.scategory && `${item.category} | ${item.scategory}`}</small></div>

                                                        <div className={`d-flex align-items-center justify-content-between gap-3`}>
                                                            {/* Edit Record */}
                                                            <button onClick={() => handleEditItem(item)} className="icon-btn-cart small add" type="button"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" /></svg></button>
                                                            {/* Delate Record */}
                                                            {<button onClick={() => setItemDeleteConfirm({
                                                                status: true,
                                                                item_id: item.item_id,
                                                                item_name: item.item
                                                            })} className="icon-btn-cart small del" type="button"><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg></button>}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>)
                                        }) : <tr><td>No items found.</td></tr>}
                                    </tbody>

                                </table>
                            </div>
                        </PerfectScrollbar>

                    </div>}

                <ConfirmModal
                    show={showLogoutConfirm}
                    title="Exit!"
                    message={`Are you sure you want to exit?`}
                    onConfirm={() => logoutAccount()}
                    onConfirmLabel="Yes"
                    onCancel={handleCancel}
                />
                <ConfirmModal
                    show={itemDeleteConfirm.status}
                    title="Remove Item"
                    message={`Are you sure you want to delete "${itemDeleteConfirm.item_name}"?`}
                    onConfirm={() => ItemDeleteHandle(itemDeleteConfirm.item_id)}
                    onConfirmLabel="Yes"
                    onCancel={handleCancel}
                />
                <AlertModal
                    show={showAlert.show}
                    title={showAlert.title}
                    message={showAlert.message}
                    onClose={() => setShowAlert({
                        title: null,
                        message: null,
                        show: false
                    })}
                />
                <AddCategoryModal show={addCategoryModal} fetchcategoriescolumn={fetchcategoriescolumn} updatecategory={handleCategoryDropdownChange} editCategory={editCategory} category={category} onCancel={() => setAddCategoryModal(false)} />

                <AddSubCategoryModal show={addSubCategoryModal} fetchcategoriescolumn={fetchsubcategoriescolumn} updatecategory={handleSubCategoryDropdownChange} editCategory={editSubCategory} category={subCategory} parentCategory={parentCategory} onCancel={() => setAddSubCategoryModal(false)} />

            </main>
        </>
    )
}