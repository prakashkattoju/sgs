export default function Units({ unit, base_unit }) {
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