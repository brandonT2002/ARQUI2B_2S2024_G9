import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
// import './scroll.css'
import { FaChevronDown } from "react-icons/fa6";

export function SelectInput({ options, placeHolder, onSelectOption, value }) {

    const [openselect, setOpenSelect] = useState(false);
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        setSelectedOption(value);
    }, [value]);

    function selectvalue(option) {
        setSelectedOption(option);
        setOpenSelect(false);
        onSelectOption(option);
    }

    function openOption() {
        setOpenSelect(true);
    }

    return (
        <div className="flex w-full">
            <input
                value={selectedOption ? selectedOption.nombre : ''}
                onClick={openOption}
                onBlur={() => {
                    setOpenSelect(false);
                }}
                id="league"
                type="text"
                className="h-10 px-2 py-4 rounded-s-md w-[92%] bg-panel_bg-light dark:bg-panel_bg-dark placeholder:text-gray-400 text-text-light dark:text-text-dark outline-none border-y border-l border-border-light dark:border-border-dark"
                placeholder={placeHolder}
                readOnly
            />
            <div
                tabIndex={0}
                onBlur={() => {
                    setOpenSelect(false);
                }}
                className="flex pr-2 items-center justify-center bg-sub-dark rounded-e-md h-10 border-y border-border-light dark:border-border-dark border-r"
                onClick={openOption}
            >
                <FaChevronDown size={12} className="text-text-light dark:text-text-dark" />
            </div>
            <div className={openselect ? "absolute w-full py-2 visible translate-y-12 max-h-52 overflow-visible opacity-100 bg-panel_bg-light/60 dark:bg-panel_bg-dark/70 backdrop-blur-sm z-10 px-2 overflow-y-auto rounded-md border border-border-light dark:border-border-dark" : "absolute w-full max-h-28 bg-yellow-700 rounded-sm top-full hidden -translate-y-10 overflow-hidden overflow-y-auto transition text-yellow-500"}>
                {options.map((item, index) => (
                    <li onMouseDown={() => selectvalue(item)} key={index} className="flex items-center gap-3 z-20 list-none text-sub_text-light dark:text-sub_text-dark font-semibold hover:text-text-light hover:dark:text-text-dark px-2 py-1 rounded-md transition-transform hover:transition-all ease-in-out duration-150x">
                        {item.icon}
                        {item.nombre}
                    </li>
                ))}
            </div >
        </div>
    );
}

SelectInput.propTypes = {
    options: PropTypes.array.isRequired,
    placeHolder: PropTypes.node.isRequired,
    onSelectOption: PropTypes.func.isRequired,
    value: PropTypes.object,
};