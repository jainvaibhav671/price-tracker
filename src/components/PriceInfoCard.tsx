import Image from "next/image";

type Props = {
    title: string;
    iconSrc: string;
    value: string
    color: string
}

export default function ProductInfoCard(props: Props) {
    return <div style={{ borderLeftColor: props.color }} className={`price-info_card bg-gray-100`}>
        <p className="text-base text-black-100">{props.title}</p>
        <div className="flex gap-1">
            <Image src={props.iconSrc} alt={props.title} width={24} height={24} />
            <p className="text-2xl font-bold text-secondary">{props.value}</p>
        </div>
    </div>
}
