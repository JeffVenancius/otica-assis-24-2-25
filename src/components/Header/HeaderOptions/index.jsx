import './HeaderOptions.css'
import HeaderOption from './HeaderOption'
import urls from "../../../data/urls.json"
import types from '../../../data/types.json'
import typesOrder from '../../../data/types_order.json'
import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import categories from '../../../data/categories.json'
import { Link } from 'react-router-dom'
import React from 'react'
import { isMobile } from 'react-device-detect'
import order from '../../../data/order_categories.json'

function useOutsideAlerter(ref, changeActive, size) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (!event.target.classList.contains("header__buttons") && size[0] > 880) {
				changeActive({1:false, 2:false, 3: false})
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
	const [actives, setActives] = useState({1: false, 2: false, 3: false})
	useOutsideAlerter(actives, setActives, size)

	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const active = props.active === props.type ? " header__options--first--active" : ""

		// <HeaderOption type={props.type} value="Todos">"Todos"</HeaderOption>
	const changeActive = (element, lvl) => {
		if (!isMobile) {
			return
		}
		let out = {...actives}
		out[lvl] = element
		if (actives[lvl] == out[lvl]) {
			for (let i = lvl; i <= 3; i++) {
				out[i] = false
			}
		}
		setActives(out)
	}
	
	const getUrl = (list) => {
		if (list.includes("Marcas")) {
			list.shift()
		}
		let out = "/"
		list.forEach(e => {
			if (urls[e]) {
				out += urls[e] + '/'
			}
		})
		return out
	}

	return (
		<div className='header__options header__options--firstlvl'>
		{order.map(e => {
			let only = false
			if (Object.keys(categories).includes(e)) {
				const first = Object.keys(categories[e])
				let second = 0
				let third = 0
				if (first.length === 1) {
					second = Object.keys(categories[e][first[0]])
					if (third.length === 1) {
						third = Object.keys(categories[e][first[0]][second[0]])
					}
				}
				if (first.length + second.length + third.length <= 3) {
					only = true
				}
			}
			return (Object.keys(categories).includes(e) && !only &&
				<div key={e} className={"first__category header__options " + (Object.values(actives).includes(e) ? "active" : "")}>
				{Object.keys(categories[e]).length > 1 ? <button ref={wrapperRef} className={"header__buttons header__buttons--first"} onClick={(el) => changeActive(e,1)}>{e}</button> : <Link reloadDocument to={getUrl([e])}><button ref={wrapperRef} className={"header__buttons header__buttons--first"} onClick={(el) => changeActive(e,1)}>{e}</button></Link>
				}
				{Object.keys(categories[e]).length > 1 && <div className='header__options--container--container'>
						<div className='header__options--container--lvl1 header__options--container--lvls'>
						{Object.keys(categories[e]).length > 1 && <Link reloadDocument to={getUrl([e])}><button className={"header__buttons solo"}>Todos</button></Link>}
					{Object.keys(categories[e]).sort().map(f => {
						let only = false
						if (Object.keys(categories[e][f]).length === 1) {
							let second = Object.keys(categories[e][f])[0]
							second = Object.keys(categories[e][f][second])
							if (second.length == 1) {
								only = true
							}
						} 
						if (Object.keys(categories[e][f]).length == 0) {
							only = true
						}
						return (
							<div key={e + f}className={"second__category header__options--item header__options--container--lvls header__options " + (Object.values(actives).includes(e+ f) ? "active" : "")}>
							{!only ? <button className={"header__buttons header__buttons--second"} onClick={(el) => changeActive(e + f,2)}>{f}</button> : <Link reloadDocument to={getUrl([e, f])}><button ref={wrapperRef} className={"header__buttons header__buttons--second"} onClick={(el) => changeActive(e + f,2)}>{f}</button></Link>}
							{!only && 
									<div className={"third__category header__options--container--lvl3 header__options--container--lvls"}>
									{Object.keys(categories[e][f]).length > 1 && <Link reloadDocument to={getUrl([e, f])}><button className='header__buttons solo'>Todos</button></Link>}
								{Object.keys(categories[e][f]).sort().map(g => {
									return (
										<React.Fragment key={e + f + g}>
										<div className={'header__options--item ' + (Object.values(actives).includes(e + f + g) ? "active" : "")}>
										{Object.keys(categories[e][f][g]).length > 1 ? <button className={"header__buttons header__buttons--third"} onClick={(el) => changeActive(e + f + g,3)}>{g}</button> : <Link reloadDocument to={getUrl([e,f,g])}><button className={"header__buttons header__buttons--third"} onClick={(e) => changeActive(e + f + g,3)}>{g}</button></Link>}
										{Object.keys(categories[e][f][g]).length > 1 &&
												<div className="fourth__category header__options--container--lvl4 header__options--container--lvls">
												{Object.keys(categories[e][f][g]).length > 1 && <Link reloadDocument to={getUrl([f,g])}><button className='header__buttons solo'>Todos</button></Link>}
											{Object.keys(categories[e][f][g]).sort().map(h => {
												return (
													<div key={e + f + g + h} className={'header__options--item ' + (Object.values(actives).includes(e + f + g + h) ? "active" : "")}>
													<Link reloadDocument to={getUrl([f,g,h])}><button className={"header__buttons header__buttons--fourth"} onClick={(el) => changeActive(e + f + g + h,4)}>{h}</button></Link>
													</div>
												)
											})}
												</div>}
										</div>
										</React.Fragment>
									)
								})}
									</div>}
							</div>
						)
					})
					}
						</div>
						</div>}
				</div>
			)
		})}
		</div>
	)
}

export default HeaderOptions
