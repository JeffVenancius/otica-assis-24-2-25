function useOutsideAlerter(ref, changeActive, size) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && size > 480) {
				changeActive(null)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, size]);
}

const NewHeaderOptions = (props) => {
	return (
		<div className="first__Category">
		<button ref={wrapperRef} className="header__buttons header__buttons--first" onClick={() => props.changeActive(props.type)} >{getTitle()}</button>
		{props.first}
		</div>
	)
}

export default NewHeaderOptions
