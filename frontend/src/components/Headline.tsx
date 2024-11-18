const Headline = ({
  content,
  id,
  onChange,
  onFocus,
  onBlur,
  borderColor,
}: {
  content: string;
  id: string;
  onChange: (id: string, value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  borderColor: string;
}) => {
  return (
    <input
      type="text"
      value={content}
      onChange={(e) => onChange(id, e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Enter Headline"
      style={{
        fontWeight: "bold",
        fontSize: "36px",
        width: "100%",
        border: `2px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "12px 16px",
        outline: "none",
        color: "#333",
        textAlign: "left",
      }}
    />
  );
};
export default Headline;
