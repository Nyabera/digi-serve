import styles from "./internal-ui.module.css";

export type StaffAvatarSize =
  | "sm"
  | "md"
  | "lg";

type StaffAvatarProps = {
  readonly name: string;
  readonly role?: string;
  readonly imageUrl?: string;
  readonly size?: StaffAvatarSize;
  readonly showIdentity?: boolean;
  readonly className?: string;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function StaffAvatar({
  name,
  role,
  imageUrl,
  size = "md",
  showIdentity = false,
  className = "",
}: StaffAvatarProps) {
  return (
    <span
      className={[
        styles.staffAvatarGroup,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={styles.staffAvatar}
        data-size={size}
        aria-hidden={imageUrl ? undefined : "true"}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" />
        ) : (
          getInitials(name)
        )}
      </span>

      {showIdentity ? (
        <span className={styles.staffIdentity}>
          <strong>{name}</strong>
          {role ? <span>{role}</span> : null}
        </span>
      ) : (
        <span className="sr-only">{name}</span>
      )}
    </span>
  );
}
