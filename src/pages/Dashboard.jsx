import { useState, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetAllItems, GetColumns, CreateItem, DeleteItemByID } from '../services/Dashboardservices';
import { GetOnlyCategories, GetSubCategories } from '../services/Productsservices';
import { useNavigate, useLocation } from "react-router-dom";
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

export default function Dashboard() {
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [packings, setPackings] = useState([])
    const [filteredPackingsColumn, setFilteredPackingsColumn] = useState([])

    const [company, setCompany] = useState([])
    const [filteredCompanyColumn, setFilteredCompanyColumn] = useState([])

    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
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
            cat_id: Yup.string()
                .required("Category is required"),
            scat_id: Yup.string()
                .required("Sub Category is required"),
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

    const handleAddItem = () => {
        setEditItem(false)
        setItemData(initialValues)
        formik.resetForm();
    }

    const handleEditItem = (record) => {
        setEditItem(true)
        setItemData(record)
        handleCategoryDropdownChange(record.cat_id)
    }

    const handleLimitChange = (e) => {
        const { value } = e.target;
        setPage(1);
        setLimit(value)
    }

    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

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
        label: 'Yes',
        value: 1
    }, {
        label: 'No',
        value: 0
    }]

    return (
        <>
            <header ref={headerRef} className="site-header">
                <div className='search-area d-flex gap-3 align-items-center justify-content-center'>
                    <img className="logo" src='/icon.jpg' alt='' />
                    <div>
                        <h1>SIRI GENERAL STORES, Kakinada</h1>
                        <p><small>Hello,</small> {user.fullname ? user.fullname : 'User'}</p>
                    </div>
                    <div style={{ maxWidth: 530 }} className="search-form d-flex gap-3 align-items-center justify-content-start">
                        <div className="form-group">
                            <input className="form-control alt" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                            <span className='search-icon'><i className="fa-solid fa-search"></i></span>
                        </div>
                    </div>
                    <button style={{ marginLeft: 'auto' }} className='icon-btn' onClick={() => setShowLogoutConfirm(true)}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                </div>
            </header>
            <main className='site-main'>
                <div className='dashboard-container'>
                    <div style={{ height: `calc(100dvh - ${(height + 20)}px)` }} className='items-list'>
                        {loading ? <div className='relative border-b border-gray-300 w-full overflow-hidden px-3 py-3 font-medium text-center text-red-500'>Items Loading...<div className='flex flex-col justify-center items-center absolute w-[100%] h-[100%] top-0 left-0 bg-white opacity-50 z-10'><FaSpinner className="relative animate-spin z-11 w-8 h-8 text-[#123E56]" /></div></div> : items.length === 0 ? <div className='relative border-b border-gray-300 w-full overflow-hidden px-3 py-3 font-medium text-center text-red-500'>No Items are available</div> :

                            <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                                <div className='items-list-inner'>
                                    <table className="table table-bordered mb-3">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div>Item Name</div>
                                                </th>
                                                <th>
                                                    <div>Category</div>
                                                </th>
                                                <th>
                                                    <div>Subcategory</div>
                                                </th>
                                                {/* <th>
                                                    <div>Company</div>
                                                </th> */}
                                                <th>
                                                    <div>Packing</div>
                                                </th>
                                                <th>
                                                    <div>Price</div>
                                                </th>
                                                <th>
                                                    <div>Status</div>
                                                </th>
                                                <th>
                                                    <div>Settings</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items?.map((item) => {
                                                return (<tr key={item.item_id} className={item.item_id === itemData?.item_id ? 'active' : ''}>
                                                    <td>{item.item}</td>
                                                    <td>{item.category}</td>
                                                    <td>{item.scategory}</td>
                                                    {/* <td>{item.comp_id}</td> */}
                                                    <td>{item.unit}</td>
                                                    <td>{priceDisplay(item.price)}</td>
                                                    <td>{item.status}</td>
                                                    <td width={60}>
                                                        <div className={`d-flex align-items-center justify-content-start gap-3`}>
                                                            {/* Edit Record */}
                                                            <button onClick={() => handleEditItem(item)} className="icon-btn-cart small add" type="button"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" /></svg></button>
                                                            {/* Delate Record */}
                                                            {<button onClick={() => setItemDeleteConfirm({
                                                                status: true,
                                                                item_id: item.item_id,
                                                                item_name: item.item
                                                            })} className="icon-btn-cart small del" type="button"><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg></button>}
                                                        </div>
                                                    </td>
                                                </tr>)
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className='d-flex justify-content-between align-items-center gap-3'>
                                                        <div className='d-flex justify-content-between align-items-center gap-3'>
                                                            <select value={limit} onChange={handleLimitChange} className='px-2 py-1 rounded'>
                                                                <option value='20'>20</option>
                                                                <option value='50'>50</option>
                                                                <option value='100'>100</option>
                                                            </select>
                                                            <label className=''>{start}-{end} of {total} records</label>
                                                        </div>
                                                        {Number(total) >= Number(limit) && <div className='d-flex justify-content-start align-tems-center gap-3'><Pagination
                                                            totalPages={totalPages}
                                                            currentPage={page}
                                                            onPageChange={setPage}
                                                        /></div>}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                </div>
                            </PerfectScrollbar>
                        }

                    </div>
                    <form onSubmit={formik.handleSubmit}>
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
                                        onClick={handleFormCancel}
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{ width: '100%' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className='relative form-group' style={{ width: '33%' }}>
                                    <button
                                        type="submit"
                                        className="btn"
                                        style={{ width: '100%' }}
                                    >{submitting && <FaSpinner className="animate-spin" />} {editItem ? 'Update' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
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