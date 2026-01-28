import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';

const ItemCartCal = ({ itemUnit, setItemUnitValue1, setItemUnitValue2, itemUnitValue1, itemUnitValue2 }) => {

    const [value1, setValue1] = useState(itemUnitValue1);
    const [value2, setValue2] = useState(itemUnitValue2);

    const setHandleValue1 = (value) => {
        setValue1(value);
        setItemUnitValue1(itemUnit === 'kg' || itemUnit === 'ltr' ? value*1000 : value)
    }

    const setHandleValue2 = (value) => {
        if (value.toString().length <= 3) {
            setValue2(value);
            setItemUnitValue2(value)
        }
    }

    return (
        <div className='d-flex flex-column align-items-stretch justify-content-between gap-2'>
            <div className='unit-input'>
                <InputNumber
                    value={value1}
                    onValueChange={(e) => setHandleValue1(e.value)}
                    useGrouping={false}
                    placeholder={itemUnit === 'kg' ? 'Enter kgs' : itemUnit === 'ltr' ? 'Enter ltrs' : 'Enter pkts'}
                />
                <span className="unit-placeholder">{itemUnit === 'kg' ? 'kg' : itemUnit === 'ltr' ? 'ltr' : 'pkt'}</span>
            </div>
            {itemUnit === 'kg' || itemUnit === 'ltr' ? <div className='unit-input'><InputNumber
                value={value2}
                onValueChange={(e) => setHandleValue2(e.value)}
                useGrouping={false}
                placeholder={itemUnit === 'kg' ? 'Enter grams' : itemUnit === 'ltr' && 'Enter ml'}
            /><span className="unit-placeholder">{itemUnit === 'kg' ? 'g' : itemUnit === 'ltr' && 'ml'}</span>
            </div> : <input type='hidden' value={value2} />}

        </div>
    )
}

export default ItemCartCal