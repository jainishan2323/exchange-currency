import Styled from 'styled-components';

export const AppWrapper = Styled.section`
    width: 400px;
    margin: 0 auto;
`;

export const FieldWrapper = Styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    position: relative;
    .subtitle {
        font-size: 14px;
    }
    .title {
        font-size: 34px;
    }
`;

export const SliderContainer = Styled.div`
    padding: 30px;
    background-color: ${props => props.toCurrency ? '#245bc2' : '#246CF9'};
    color: #fff;
`;

export const StyledInput = Styled.input`
    border: none;
    background: transparent;
    font-size: 34px;
    line-height: 34px;
    color: #fff;
    outline: none;
    border-bottom: 1px solid rgba(255,255,255,0.5);;
    text-align: center;
    width: 110px;
`;

export const StyledSubmitButton = Styled.input`
    width: 100%;
    font-size: 18px;
    padding: 8px;
    background-color: #246CF9;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    margin-top: 4px;
    &:hover {
        background-color: #245bc2;
    }
    &:disabled {
        background-color: lightgrey;
        cursor: not-allowed;
    }
`;

export const StyledMessage = Styled.div`
    color: ${props => props.error ? '#E9414E' : '#70B974'};
    font-size: 18px;
    text-align: center;
`;
