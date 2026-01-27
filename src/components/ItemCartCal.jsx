import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';

const ItemCartCal = ({ itemUnit, setItemUnit, setItemUnitValue }) => {

    const [tempItemUnit, setTempItemUnit] = useState(itemUnit)
    const [value, setValue] = useState(null);

    const units = (itemUnit === 'kg' || itemUnit === 'g') ? [
        { name: 'kg', value: 'kg' },
        { name: 'g', value: 'g' }
    ] : (itemUnit === 'ml' || itemUnit === 'ltr') ? [
        { name: 'ltr', value: 'ltr' },
        { name: 'ml', value: 'ml' }
    ] : [
        { name: 'pkt', value: 'pkt' },
    ]

    const setHandleValue = (value) => {
        console.log("ItemUnitValue", value)
        if((tempItemUnit === 'g' || tempItemUnit === 'ml') && value.toString().length > 3){
            alert("Max. 3 digits allowed")
            return 
        } 
        setValue(value);
        setItemUnitValue(value)
    }
    return (
        <div className='d-flex align-items-center gap-2'>
            <Dropdown
                value={tempItemUnit}
                options={units}
                optionLabel="name"
                appendTo="self"
                onChange={(e) => {
                    setTempItemUnit(e.value)
                    setItemUnit(e.value)
                    console.log("ItemUnit", e.value)
                }}
                placeholder='select'
            />
            <InputNumber
                value={value}
                onValueChange={(e) => setHandleValue(e.value)}
                min={1}
                max={tempItemUnit === 'g' || tempItemUnit === 'ml' ? 999 : 9999}
                minFractionDigits={tempItemUnit === 'kg' || tempItemUnit === 'ltr' ? 1 : 0}
                useGrouping={false}
                disabled={tempItemUnit === '' || tempItemUnit === null || tempItemUnit === undefined}
            />
        </div>
    )
}

export default ItemCartCal