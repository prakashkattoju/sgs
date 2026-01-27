export default function Units({ unit, base_unit }) {
    switch (unit) {
        case 'g':
            return <div className="units">{base_unit == 1000 ? '1 kg' : `${base_unit} g`}</div>;
        case 'pkt':
            return <div className="units">{base_unit == 1 ? '1 pkt' : `${base_unit} pkts`}</div>;
        case undefined || null || '':
            return <div className="units">{'1 pkt'}</div>;
        default:
            return <div className="units">{unit}</div>;
    }
}