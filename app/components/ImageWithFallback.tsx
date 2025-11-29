export function ImageWithFallback(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  return (
    <img
      {...props}
      onError={(e) => {
        e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
      }}
    />
  );
}
