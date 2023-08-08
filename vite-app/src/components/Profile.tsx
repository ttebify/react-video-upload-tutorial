import RemoteImage from "./RemoteImage";

export default function Profile() {
  return (
    <div className="flex flex-col items-center gap-3">
      <RemoteImage
        src="https://source.unsplash.com/random"
        fallbackSource="/images/customer-skin.jpg"
        alt="Profile Image"
        containerClassName="w-40 h-40 rounded-full overflow-hidden"
        imgClassName="rounded-full"
      />
      <div className="text-4xl font-medium text-center">Sudo Alien</div>
      <p className="text-base text-gray-500 text-center max-w-md">
        The best code is written one step at a time, with security and quality
        in mind at every step.
      </p>
    </div>
  );
}
