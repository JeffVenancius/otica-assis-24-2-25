import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import urls from '../../data/urls.json'
import './Produto.css'
import WppButtonProduct from './WppButtonProduct'

const Produto = () => {
	const params = useParams()
	const product = params.product
	const [currItem, setCurrItem] = useState({
		'imgs': [],
		'modelo': ''
	})
	const brand = product.split("$$")[0]

	useEffect(() => {
		let currSelection = urls[brand]
		const fetchUrl = '/data/items/' + currSelection + '.json'
		fetch(fetchUrl, {method: 'GET'})
			.then(res => res.json())
			.then(items => {
				for (let i = 0; i < items.length; i++) {
					const brand_item = brand
					const model_item = items[i]['modelo']
					const wppDesc_item = items[i]['wppDesc']
					if (brand_item + "$$" + model_item + " " + wppDesc_item === product) {
						setCurrItem(items[i])
						break
					}
				}
			})
	},[])
	return (
		<div className="product">
			<div className="imgCaroussel" >
				<img src={currItem['imgs'][0]}/>
			</div>
			<div className="product__specs">
				<div className="product__specs--specs">
					<h1>sdaasdsad{brand}</h1>
					<p className="product__specs--model">modelo</p>
					{currItem['modelo'] && <p>{currItem['modelo']}</p>}
				</div>
				<div className="product__specs--price">
					<p><strong>10x de R$ 100,00</strong> sem juros</p>
					<p><strong>ou R$ {currItem['preco']},00</strong> à vista</p>
				</div>
				<WppButtonProduct
					mensagem={'Olá! Gostei desse ' + brand + ', modelo ' + currItem['modelo'] + currItem['wppDesc'] + ' que encontrei no Site!'}
					texto={"Eu quero!"}
				/>
			</div>
		</div>
	)
}

export default Produto
