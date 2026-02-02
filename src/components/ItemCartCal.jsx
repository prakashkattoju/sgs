import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';

const ItemCartCal = ({ itemUnit, setItemUnitValue1, setItemUnitValue2, itemUnitValue1, itemUnitValue2 }) => {

    const [value1, setValue1] = useState(itemUnitValue1);
    const [value2, setValue2] = useState(itemUnitValue2);

    const setHandleValue1 = (value) => {
        setValue1(value);
        setItemUnitValue1(itemUnit === 'kg' || itemUnit === 'ltr' ? value * 1000 : value)
    }

    const setHandleValue2 = (value) => {
        if (value.toString().length <= 3) {
            setValue2(value);
            setItemUnitValue2(value)
        }
    }

    return (
        <div className='d-flex flex-column align-items-center justify-content-center gap-3'>
            <div className='unit-input'>
                <label className="unit-placeholder">{itemUnit === 'kg' ? 'Kg' : itemUnit === 'ltr' ? 'Ltr' : itemUnit === 'unit' ? 'Unit' : 'PKT'}</label>
                <InputNumber
                    value={value1}
                    onValueChange={(e) => setHandleValue1(e.value)}
                    useGrouping={false}
                    placeholder={itemUnit === 'kg' ? 'Enter kgs' : itemUnit === 'ltr' ? 'Enter ltrs' : itemUnit === 'unit' ? 'Enter units' : 'Enter pkts'}
                    showButtons
                    buttonLayout="horizontal"
                    incrementButtonIcon="fa-solid fa-plus"
                    decrementButtonIcon="fa-solid fa-minus"
                    step={1}
                    min={0}
                />

            </div>
            {itemUnit === 'kg' || itemUnit === 'ltr' ?
                <div className='unit-input'>
                    <label className="unit-placeholder">{itemUnit === 'kg' ? 'G' : itemUnit === 'ltr' && 'ML'}</label>
                    <InputNumber
                        value={value2}
                        onValueChange={(e) => setHandleValue2(e.value)}
                        useGrouping={false}
                        placeholder={itemUnit === 'kg' ? 'Enter grams' : itemUnit === 'ltr' && 'Enter ml'}
                        showButtons
                        buttonLayout="horizontal"
                        incrementButtonIcon="fa-solid fa-plus"
                        decrementButtonIcon="fa-solid fa-minus"
                        step={50}
                        min={0}
                    />
                </div> : <input type='hidden' value={value2} />}

        </div>
    )
}

export default ItemCartCal