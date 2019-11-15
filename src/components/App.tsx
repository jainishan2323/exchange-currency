import React from 'react';
import idx from 'idx';
import Slider from 'react-slick';

import {
    AppWrapper,
    FieldWrapper,
    SliderContainer,
    StyledInput,
} from './styles';

import { getExchangedRate } from './utils';

const Wallet = {
    "GBP" :{
        id: "GBP",
        displayName: "British Pound",
        amount: 200,
        symbol: "£",
    },
    "USD": {
        id: "USD",
        displayName: "US Dollar",
        amount: 200,
        symbol: "$",
    },
    "EUR": {
        id: "EUR",
        displayName: "Euro",
        amount: 200,
        symbol: "€"
    }
};

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

export default class App extends React.PureComponent<any, any> {
    public toSliderRef: React.RefObject<HTMLDivElement> = React.createRef(); 
    public inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    public state = {
        fromCurrency: 'GBP',
        fromValue: '',
        toValue: '',
        toCurrency: 'GBP',
        loading: false,
        exchangeRate: 1,
    }

    componentDidMount() {
        // this.timer = setInterval(() => this.fetchCurrency(), 1000);
        this.fetchCurrency();
    }

    componentWillUnmount() {
        // this.timer = null;
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

        fetch(`https://api.exchangeratesapi.io/latest?symbols=${toCurrency}&base=${fromCurrency}`)
        .then((result) => result.json())
        .then((data) => {
            const rate = idx(data, _ => _.rates[toCurrency]);
            this.setState({
                loading: false,
                exchangeRate: rate,
            })
        }).catch((err) => {
            this.setState({
                loading: true,
            })
        })
    }

    public onSubmit = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {
            fromCurrency,
            fromValue,
            toValue,
            toCurrency,
        } = this.state;
        if (!fromValue || !toValue) {
            return;
        }
        if (fromValue > Wallet[fromCurrency].amount) {
            // insufficent funds
            return;
        }
        console.log(`Credited ${Wallet[toCurrency].symbol} ${toValue} into account`)
    }

    public onFromValueUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value) {
            this.setState((_prevState) => ({
                fromValue: parseFloat(value)
            }));
        } else {
            this.setState({
                fromValue: '',
            })
        }
    }

    public onFromCurrencyChange = (currentSlide: number) => {
        if (currentSlide !== undefined) {
            const slideId = Object.keys(Wallet)[currentSlide];
            this.setState(() => ({
                fromCurrency: slideId,
                loading: true,
            }), this.fetchCurrency);
        }
    }

    public onToCurrencyChange = (currentSlide: number) => {

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
            fromValue,
            loading,
            exchangeRate
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
                                            <h2>{Wallet[currency].id}</h2>
                                            <p className='subtitle'>
                                                You have &nbsp;
                                                {Wallet[currency].symbol}
                                                {Wallet[currency].amount}
                                            </p>
                                        </div>
                                        <div>
                                            <form>
                                                <StyledInput
                                                    min='0'
                                                    type="number"
                                                    step="any"
                                                    max={Wallet[currency].amount}
                                                    value={fromValue}
                                                    onChange={this.onFromValueUpdate}
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
                                            <h2>{Wallet[currency].id}</h2>
                                            <p className='subtitle'>
                                                You have &nbsp;
                                                {Wallet[currency].symbol}
                                                {Wallet[currency].amount}
                                            </p>
                                        </div>
                                        {
                                            !loading ? (
                                                <div>
                                                    <h2 className='title'>{getExchangedRate(fromValue, exchangeRate)}</h2>
                                                </div>
                                            ) : null
                                        }
                                    </FieldWrapper>
                                </div>
                            ))
                        }
                    </Slider>
                </SliderContainer>
            </AppWrapper>
        )
    }
}