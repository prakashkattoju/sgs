import { useState } from 'react'
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart } from '../store/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import Units from './Units'
import ItemCartCal from './ItemCartCal';
import ConfirmModal from './ConfirmModal';
import priceDisplay from '../util/priceDisplay';
import { it } from 'date-fns/locale';

const ItemCard = ({ index, item }) => {
    console.log("item", item)
    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const [AddToCartModalIndex, setAddToCartModalIndex] = useState(null)
    const [confirm, setConfirm] = useState({
        status: false,
        item_id: null,
        item_name: null
    });

    const [itemUnitValue1, setItemUnitValue1] = useState(0)
    const [itemUnitValue2, setItemUnitValue2] = useState(0)

    const getQuantity = (item_id) => {
        const qty = cart.find((el) => el.item_id === item_id);
        return qty.itemUnitValue;
    }

    const checkForAdd = (item_id) => {
        const found = cart.some(el => el.item_id === item_id);
        return found;
    }

    const addToCartModalOpen = (item) => {
        setAddToCartModalIndex(item.item_id);
    };

    const addOptToCart = (item) => {

        const itemUnit = item.unit === 'KG' ? itemUnitValue1 + itemUnitValue2 >= 1000 ? 'KG' : 'G' : item.unit

        const itemUnitValue = item.unit === 'KG' ? (itemUnitValue1 + itemUnitValue2) / 1000 : 1

        const itemTotal = itemUnitValue * item.price;

        const cartItem = {
            'item_id': parseInt(item.item_id),
            'title': item.item,
            'price': parseFloat(item.price),
            'totalPrice': parseFloat(itemTotal),
            'itemUnit': itemUnit,
            'itemUnitValue': itemUnitValue,
        }
        dispatch(addToCart(cartItem))
        handleAddToCartModalCancel()
    }

    const decrement = (item_id) => {
        dispatch(decrementQuantity(item_id));
    }
    const increment = (item_id) => {
        dispatch(incrementQuantity(item_id));
    }

    const handleAddToCartModalCancel = () => {
        setItemUnitValue1(0)
        setItemUnitValue2(0)
        document.activeElement?.blur();
        setAddToCartModalIndex(null);
    };

    const remove = (item_id) => {
        dispatch(removeFromCart(item_id));
        setItemUnitValue1(0)
        setItemUnitValue2(0)
        handleCancel()
    }

    const handleCancel = () => {
        document.activeElement?.blur();
        setConfirm({
            status: false,
            item_id: null,
            item_name: null
        });
    };

    function toTitleCase(str) {
        // 1. Convert the entire string to lowercase for consistency
        str = str.toLowerCase();

        // 2. Split the string into an array of words based on spaces
        const words = str.split(' ');

        // 3. Map over the words array, capitalizing the first letter of each word
        const titleCasedWords = words.map(word => {
            // Check if the word is not empty to avoid errors with extra spaces
            if (word.length > 0) {
                // Capitalize the first character and add the rest of the word in lowercase
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return ''; // Return empty string for extra spaces (if any)
        });

        // 4. Join the array of title cased words back into a single string
        return titleCasedWords.join(' ');
    }

    return (
        <>
            <div key={index} className="item">
                <div className='item-inner' role='button'>
                    <div className="meta">
                        <h2>{toTitleCase(item.item)} {item.packing && ` - ${item.packing}`}</h2>
                    </div>
                    {/* <div className='price'>{priceDisplay(item.price)}</div> */}
                    <div className="meta" style={{ marginTop: 'auto' }}>
                        <Units item_id={item.item_id} unit={item.unit} base_unit={item.base_unit} />
                        <div className="cart-action">
                            {item.unit !== 'KG' ? checkForAdd(parseInt(item.item_id)) ?
                                (<div className="opt">
                                    <button className="icon-btn-cart del" onClick={() => decrement(parseInt(item.item_id))}><i className="fa-solid fa-minus"></i></button>
                                    <div className="qty">{getQuantity(parseInt(item.item_id))}</div>
                                    <button className="icon-btn-cart add" onClick={() => increment(parseInt(item.item_id))}><i className="fa-solid fa-plus"></i></button>
                                </div>) :
                                <button className="btnAddAction init" onClick={() => addOptToCart(item)}>Add</button> : checkForAdd(parseInt(item.item_id)) ? 
                                    <button onClick={() => setConfirm({
                                    status: true,
                                    item_id: item.item_id,
                                    item_name: item.item
                                })} className='btnAddAction init remove'>REMOVE <i className="fa-solid fa-trash-can"></i></button> : <button onClick={() => addToCartModalOpen(item)} className='btnAddAction init'>ADD</button>}
                        </div>
                    </div>
                </div>

                {!checkForAdd(parseInt(item.item_id)) &&
                    <div
                        className={`dfc-modal modal fade ${AddToCartModalIndex === item.item_id ? "show d-flex" : ""}`}
                        id={`AddToCartModal${index}`}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title small"><span>{item.item}</span>Enter kg (and/or) grams values</h4>
                                </div>
                                <div className="modal-body">
                                    <ItemCartCal itemUnit={item.unit} setItemUnitValue1={setItemUnitValue1} setItemUnitValue2={setItemUnitValue2} itemUnitValue1={itemUnitValue1} itemUnitValue2={itemUnitValue2} />
                                </div>
                                <div className="modal-footer align-items-center justify-content-center gap-3">
                                    <button type="button" className="btn btn-secondary" onClick={handleAddToCartModalCancel}>Cancel</button>
                                    <button disabled={itemUnitValue1 + itemUnitValue2 === 0} className="btn" onClick={() => addOptToCart(item)}><span>Add</span></button>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
            <ConfirmModal
                show={confirm.status}
                title="Remove Item"
                message={`Are you sure you want to remove "${confirm.item_name}" from order?`}
                onConfirm={() => remove(confirm.item_id)}
                onConfirmLabel="Yes"
                onCancel={handleCancel}
            />
        </>
    )
}

export default ItemCard