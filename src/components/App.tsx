import React from 'react';
import { connect, Dispatch } from 'react-redux';
import idx from 'idx';
import Slider from 'react-slick';

import {
    AppWrapper,
    FieldWrapper,
    SliderContainer,
    StyledInput,
    StyledSubmitButton,
    StyledMessage,
} from './styles';

import { getExchangedRate } from './utils';
import { IAppState, IWallet } from '../types';

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

interface IProps {
    dispatch: Dispatch<any>;
    Wallet: IWallet;
}

interface IState {
    fromCurrency: string;
    fromAmount: string | number;
    toCurrency: string;
    loading: boolean;
    exchangeRate: any;
    message: string;
    error: boolean;
}

class App extends React.PureComponent<IProps, IState> {
    public toSliderRef: React.RefObject<HTMLDivElement> = React.createRef(); 
    public inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    public timer = null;
    private pollInterval = 10000;

    public state = {
        fromCurrency: 'GBP',
        fromAmount: '',
        toCurrency: 'GBP',
        loading: false,
        exchangeRate: 1,
        message: '',
        error: false,
    }

    componentDidMount() {
        this.timer = setInterval(() => this.fetchCurrency(), this.pollInterval);
    }

    componentWillUnmount() {
        this.timer = null;
    }

    fetchCurrency() {
        const {
            fromCurrency,
            toCurrency,
        } = this.state;

        if (fromCurrency === toCurrency) {
            this.setState({
                loading: false,
                exchangeRate: 1,
            });
            return;
        }

        fetch(`https://api.exchangeratesapi.io/latest?symbols=${toCurrency}&base=${fromCurrency}`, {
            cache: 'no-cache',
        })
        .then((result) => result.json())
        .then((data) => {
            const rate = idx(data, _ => _.rates[toCurrency]);
            this.setState({
                loading: false,
                exchangeRate: rate,
                message: '',
                error: false,
            })
        }).catch((err) => {
            this.setState({
                loading: true,
                message: 'Unable to fetch exchange rate, please refresh.',
                error: true,
            })
        })
    }

    public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {
            Wallet,
            dispatch,
        } = this.props;
        const {
            fromCurrency,
            exchangeRate,
            fromAmount,
            toCurrency,
            loading,
        } = this.state;
        if (loading || !fromAmount || !exchangeRate) {
            return;
        }

        if (fromCurrency === toCurrency) {
            return;
        }
        if (fromAmount > Wallet[fromCurrency].amount) {
            this.setState({
                message: 'Insufficent funds',
                error: true,
            });
            return;
        }

        const toAmount = parseFloat(getExchangedRate(fromAmount, exchangeRate));

        dispatch({ type: "COMPUTE_BALANCE", fromCurrency, toCurrency, fromAmount, toAmount });
        this.setState({
            message: 'Amount exchange success.',
            error: false,
        });
        console.log(`Credited ${Wallet[toCurrency].symbol} ${toAmount} into account`)
    }

    public onfromAmountUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value) {
            this.setState((_prevState) => ({
                fromAmount: parseFloat(value)
            }));
        } else {
            this.setState({
                fromAmount: '',
            })
        }
    }

    public onFromCurrencyChange = (currentSlide: number) => {
        const {
            Wallet
        } = this.props;
        if (currentSlide !== undefined) {
            const slideId = Object.keys(Wallet)[currentSlide];
            this.setState(() => ({
                fromCurrency: slideId,
                loading: true,
            }), this.fetchCurrency);
        }
    }

    public onToCurrencyChange = (currentSlide: number) => {
        const {
            Wallet
        } = this.props;
        if (currentSlide !== undefined) {
            const slideId = Object.keys(Wallet)[currentSlide];
            this.setState(() => ({
                toCurrency: slideId,
                loading: true,
            }), this.fetchCurrency);
        }
    }

    public render() {
        const {
            Wallet
        } = this.props;
        const {
            fromAmount,
            loading,
            exchangeRate,
            toCurrency,
            fromCurrency,
            error,
            message,
        } = this.state;
        return (
            <AppWrapper>
                <SliderContainer>
                    <Slider
                        {...sliderSettings}
                        afterChange={this.onFromCurrencyChange}
                        ref={this.toSliderRef}
                    >
                        {
                            Object.keys(Wallet).map((currency) => (
                                <div key={currency}>
                                    <FieldWrapper>
                                        <div>
                                            <h2 className='title'>{Wallet[currency].id}</h2>
                                            <p className='subtitle'>
                                                You have &nbsp;
                                                {Wallet[currency].symbol}
                                                {Wallet[currency].amount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <form onSubmit={this.onSubmit} id="submitForm">
                                                <StyledInput
                                                    min='0'
                                                    type="number"
                                                    step="any"
                                                    max={Wallet[currency].amount}
                                                    value={fromAmount}
                                                    onChange={this.onfromAmountUpdate}
                                                    ref={this.inputRef}
                                                />
                                            </form>
                                        </div>
                                    </FieldWrapper>
                                </div>
                            ))
                        }
                    </Slider>
                </SliderContainer>
                <SliderContainer toCurrency>
                    <Slider {...sliderSettings} afterChange={this.onToCurrencyChange}>
                        {
                            Object.keys(Wallet).map((currency) => (
                                <div key={currency}>
                                    <FieldWrapper>
                                        <div>
                                            <h2 className='title'>{Wallet[currency].id}</h2>
                                            <p className='subtitle'>
                                                You have &nbsp;
                                                {Wallet[currency].symbol}
                                                {Wallet[currency].amount.toFixed(2)}
                                            </p>
                                        </div>
                                        {
                                            !loading ? (
                                                <div>
                                                    <h2 className='title'>
                                                        {getExchangedRate(fromAmount, exchangeRate)}
                                                    </h2>
                                                    <p className='subtitle'>
                                                        {Wallet[toCurrency].symbol}1 =
                                                        &nbsp;
                                                        {Wallet[fromCurrency].symbol}
                                                        {(1/exchangeRate).toFixed(2)}
                                                    </p>
                                                </div>
                                            ) : null
                                        }
                                    </FieldWrapper>
                                </div>
                            ))
                        }
                    </Slider>
                </SliderContainer>
                <StyledSubmitButton disabled={fromCurrency === toCurrency} type="submit" form="submitForm" value="Exchange" />
                <StyledMessage error={error}>{message}</StyledMessage>
            </AppWrapper>
        )
    }
}

const mapStateToProps = (state: IAppState) => ({
    Wallet: state.Wallet
});

export default connect(mapStateToProps)(App);