import PropTypes from 'prop-types';

export function Button({ icon, label, onclick }) {
    return (
        <button type="submit" className="flex items-center gap-2 bg-background-light dark:bg-[#6366f1] text-text-light dark:text-text-dark h-fit py-2 px-4 rounded-md"
            onClick={onclick}>
            {icon}
            <span>{label}</span>
        </button>
    )
}

Button.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onclick: PropTypes.func.isRequired
};