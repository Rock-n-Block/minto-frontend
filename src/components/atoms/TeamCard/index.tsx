import React from 'react';

export interface ITeamCard {
  photo: string;
  name: string;
  position: string;
  className?: string;
}

const TeamCard: React.FC<ITeamCard> = ({ photo, name, position, className }) => {
  return (
    <div className={`team-card ${className}`}>
      <img className="team-card__img" src={photo} alt={`of ${name}`} />
      <h3 className="team-card__name text-bold text-green text">{name}</h3>
      <p className="team-card__position">{position}</p>
    </div>
  );
};

export default TeamCard;
