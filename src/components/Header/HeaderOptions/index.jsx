import './HeaderOptions.css'
import HeaderOption from './HeaderOption'
import urls from "../../../data/urls.json"
import types from '../../../data/types.json'
import { useEffect, useRef, useLayoutEffect, useState } from 'react';

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


const HeaderOptions = (props) => {
	const [size, setSize] = useState([0, 0]);
	const wrapperRef = useRef(null)
	useOutsideAlerter(wrapperRef, props.changeActive, size)

	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

		let currSelections = window.location.pathname.split('/')
		let typesList = {}
		for (let i = 0; i < Object.keys(urls).length; i++) {
			for (let j = 0; j < currSelections.length; j++) {
				if (urls[Object.keys(urls)[i]] === currSelections[j]) {
					currSelections[j] = [Object.keys(urls)[i], currSelections[j]]
					break
				}
			}
		}

		for (let i = 0; i < currSelections.length; i++) {
			for (let j = 0; j < Object.keys(types).length; j++) {
				let t = types[Object.keys(types)[j]]
				if (t.includes(currSelections[i][0])) {
					typesList[Object.keys(types)[j]] = currSelections[i]
					break
				}
			}
		}

	const getTitle = () => {
		if (Object.keys(typesList).includes(props.type)) {
			return typesList[props.type][0]
		}
		return props.type
	}
	const active = props.active === props.type ? " header__options--first--active" : ""

	console.log(props.possibleFilters)


	return (
		<div className={'header__options' + active}>
		<button ref={wrapperRef} className="header__buttons header__buttons--first" onClick={() => props.changeActive(props.type)} >{getTitle()}</button>
		<div className={'header__options--container'} >
		<HeaderOption type={props.type} value="Todos">"Todos"</HeaderOption>
		{props.options.filter(e => props.possibleFilters.includes(e)).sort().map(e => <HeaderOption type={props.type} value={e} key={e + "__option"} url={urls[e]}>{e}</HeaderOption>)}
		</div>
		</div>
	)
}

export default HeaderOptions
