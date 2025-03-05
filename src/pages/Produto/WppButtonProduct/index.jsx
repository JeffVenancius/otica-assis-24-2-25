import { useSearchParams } from 'react-router';
import './WppButtonProduct.css'

const WppButtonProduct = (props) => {
	const [searchParams] = useSearchParams();
	const wppLink = "https://api.whatsapp.com/send/?phone=55"
	const currWpp = searchParams.get("wpp") ? searchParams.get("wpp") : "3598652571"
	return <a className='wpp__link__product' href={wppLink + currWpp + "&text=" + props.mensagem}><button className="wpp__button__product">{props.texto}</button></a>
}

export default WppButtonProduct
