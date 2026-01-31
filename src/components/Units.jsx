import { useSelector } from 'react-redux';
import priceDisplay from '../util/priceDisplay';

export default function Units({ item_id, unit, base_unit }) {

    const cart = useSelector((state) => state.cart.cart);

    const item = cart.find(el => el.item_id == item_id);

    if(item) 
        return <div className="units text-start">{item.itemUnit === 'g' || item.itemUnit === 'ml' ? item.itemUnitValue * 1000 : item.itemUnitValue} {`${item.itemUnit === 'unit' || item.itemUnit === 'pkt' ? `${item.itemUnit}(s)` : item.itemUnit}`}<br />{priceDisplay(item.totalPrice)} </div>;

    switch (unit) {
        case 'kg':
            return <div className="units">{base_unit == 1000 ? '1 kg' : `${base_unit} g`}</div>;
        case 'pkt':
            return <div className="units">{base_unit == 1 ? '1 pkt' : `${base_unit} pkts`}</div>;
        case 'ltr':
            return <div className="units">{base_unit == 1000 ? '1 ltr' : `${base_unit} ml`}</div>;
        case 'unit':
            return <div className="units">{base_unit == 1 ? '1 unit' : `${base_unit} units`}</div>;
        default:
            return <div className="units">{unit}</div>;
    }
}