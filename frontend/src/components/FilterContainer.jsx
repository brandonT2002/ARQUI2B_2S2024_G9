import PropTypes from 'prop-types';


export function FilterContainer({ icon, label, element}) {
    

    return (
        <div className="flex items-center flex-row w-full gap-3 h-full">
            <div className='flex p-3 items-center justify-center rounded-md bg-subpanel_bg-light dark:bg-subpanel_bg-dark'>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className='text-text-light dark:text-text-dark'>{label}</span>
                <div className='relative basis-3/4 h-10'>
                    {element}
                </div>
            </div>
        </div>
    )
}

FilterContainer.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    element: PropTypes.object.isRequired,
}

