
import { useState, useEffect, useRef } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ value, onChange, options, placeholder, required, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const wrapperRef = useRef(null);

    // Initialize options
    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    // Initialize search term if value exists
    useEffect(() => {
        if (value) {
            setSearchTerm(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset search term to value if closed without selecting
                const exists = options.some(opt => opt === searchTerm || opt.label === searchTerm);

                if (!exists && value) {
                    setSearchTerm(value);
                } else if (!value) {
                    setSearchTerm('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchTerm, value, options]);

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setIsOpen(true);

        const filtered = options.filter(option => {
            const label = typeof option === 'string' ? option : option.label;
            return label.toLowerCase().includes(term.toLowerCase());
        });
        setFilteredOptions(filtered);

        // Always propagate change so parent state matches input
        onChange({ target: { name, value: term } });
    };

    const handleSelect = (option) => {
        const val = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;

        setSearchTerm(label);
        onChange({ target: { name, value: val } });
        setIsOpen(false);
        setFilteredOptions(options); // Reset list
    };

    const handleInputClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setFilteredOptions(options);
        }
    };

    return (
        <div className={`custom-select-container ${isOpen ? 'open' : ''}`} ref={wrapperRef}>
            <div className="custom-select-input-wrapper">
                <input
                    type="text"
                    className="custom-select-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    required={required}
                    name={name} // Pass name for compatibility if needed, though onChange handles it
                />
                <span className="custom-select-icon">▼</span>
            </div>

            {isOpen && (
                <ul className="custom-select-list">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => {
                            const val = typeof option === 'string' ? option : option.value;
                            const label = typeof option === 'string' ? option : option.label;

                            return (
                                <li
                                    key={index}
                                    className={`custom-select-option ${value === val ? 'selected' : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {label}
                                </li>
                            );
                        })
                    ) : (
                        <li className="custom-select-option no-results">No se encontraron resultados</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
