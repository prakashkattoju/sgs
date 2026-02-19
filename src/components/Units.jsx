import { useSelector } from 'react-redux';
import priceDisplay from '../util/priceDisplay';

export default function Units({ item_id, unit, base_unit }) {

    const cart = useSelector((state) => state.cart.cart);

    const item = cart.find(el => el.item_id == item_id);

    if (item) {
        const { itemUnitValue, itemUnit } = item;
        return <div className="units text-start">{unit === 'KG' ? itemUnitValue > 1 ? itemUnitValue : itemUnitValue * 1000 : itemUnitValue} { unit === 'KG' ? `${itemUnitValue > 1 ? 'KG' : 'G'}` : `${itemUnitValue > 1 ? `${itemUnit}'S` : itemUnit}`}</div>;
    }

    switch (unit) {
        case 'KG':
            return <div className="units">{base_unit == 1000 ? 'KG' : `${base_unit} G`}</div>;
        default:
            return <div className="units">{unit}</div>;
    }
}