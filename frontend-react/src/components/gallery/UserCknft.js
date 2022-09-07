import CknftCard from "../cknftCard/CknftCard";

const UserCKNFT = ({ userCknftDetails }) => {
  return (
    <>
      <div className="is-flex is-justify-content-center is-flex-wrap-wrap custom-gallery-gap">
        {userCknftDetails.map((CKNFT, index) => (
          <CknftCard key={index} cknftDetails={CKNFT} />
        ))}
      </div>
    </>
  );
};

export default UserCKNFT;
