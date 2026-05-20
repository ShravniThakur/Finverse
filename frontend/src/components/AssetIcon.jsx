const AssetIcon = ({ src, alt = "", size = 18, className = "", style }) => (
    <img
        src={src}
        alt={alt}
        className={`object-contain flex-shrink-0 ${className}`}
        style={{ width: size, height: size, ...style }}
    />
)

export default AssetIcon

