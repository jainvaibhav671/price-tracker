import Image from "next/image";

type Props = {
    title: string;
    iconSrc: string;
    value: string
    color: string
}

export default function ProductInfoCard(props: Props) {
    return <div style={{ borderLeftColor: props.color }} className={`flex-1 min-w-[200px] flex flex-col px-4 py-6 gap-4 border border-l-4 border-border rounded-2xl bg-background`}>
        <p className="text-md text-foreground/90">{props.title}</p>
        <div className="flex gap-1">
            <Image src={props.iconSrc} alt={props.title} width={24} height={24} />
            <p className="text-2xl font-bold">{props.value}</p>
        </div>
    </div>
}
