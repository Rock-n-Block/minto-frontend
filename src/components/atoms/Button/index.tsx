import React from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd } from 'antd';
import classNames from 'classnames';

export interface IColorScheme {
  colorScheme?: 'green' | 'outline' | 'white';
}

export interface ISize {
  size?: 'ssm' | 'sm' | 'lsm' | 'smd' | 'md' | 'lmd' | 'lg';
}

export interface ButtonProps extends IColorScheme, ISize {
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  link?: string;
  linkClassName?: string;
  shadow?: boolean;
  icon?: string;
  type?: 'submit' | 'button' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = 'md',
  colorScheme = 'green',
  onClick,
  disabled = false,
  loading = false,
  link,
  linkClassName,
  icon,
  type = 'button',
}) => {
  const BtnContent = (
    <>
      {icon ? <img src={icon} alt="icon" className="btn-icon" /> : <></>}
      {children}
    </>
  );

  const Btn = (
    <BtnAntd
      onClick={onClick}
      disabled={disabled || loading}
      htmlType={type}
      className={classNames(
        className || '',
        'text text-bold btn',
        `btn-${size}`,
        `btn-${colorScheme}`,
        {
          'btn-loading': loading,
        },
      )}
    >
      {loading ? 'In progress...' : BtnContent}
    </BtnAntd>
  );
  if (link) {
    return (
      <Link className={classNames('btn-link', linkClassName)} to={link}>
        {Btn}
      </Link>
    );
  }
  return Btn;
};

export default Button;
