import React from 'react'
import "./Wishlist.css"
import Axios from 'axios'
import { API_URL } from '../../../../constants/API'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
// import { priceFormatter } from '../../../supports/helpers/PriceFormatter'
import Buttons from '../../../../component/Button/Buttons'
import swal from "sweetalert";
import { Alert } from 'reactstrap'

class Wishlist extends React.Component {
    state = {
        // productList: [],
        recipeList: [],
        // activePage: "recipe"
    }

    // getWishilistProduct = () => {
    //     Axios.get(`${API_URL}/wishlistProducts`, {
    //         params: {
    //             userId: this.props.user.id,
    //             _expand: "product",
    //         }
    //     })
    //         .then(res => {
    //             this.setState({ productList: res.data })
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // }

    getWishilistResep = () => {
        Axios.get(`${API_URL}/rencana/pengguna/${this.props.user.id}`)
            .then(res => {
                console.log(res.data)
                this.setState({ recipeList: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        // this.getWishilistProduct()
        this.getWishilistResep()
    }

    renderWishlist = () => {
        // const { activePage } = this.state;
        // if (activePage === "recipe") {
        const { recipeList } = this.state
        return recipeList.map(val => {
            const { recipes, users } = val
            const { recipeName, numbServings, cookTime, image } = recipes
            const { fullname } = users
            return (
                    <div className="d-flex flex-column justify-content-center wishlist" key={val.id.toString()}>
                        <Link
                            to={`/resep/${val.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <img src={image} alt="" style={{ width: "250px", height: "250px", objectFit: "contain" }} />
                            <br />
                            <h6 className="mt-2">{recipeName}</h6>
                            <p>Oleh: {fullname}</p>
                            <div className="d-flex justify-content-around mt-3">
                                <div className="d-flex details">
                                    <i className="material-icons mr-2">&#xe192;</i>
                                    <p style={{ color: "inherit" }}>{cookTime} menit</p>
                                </div>
                                <div className="d-flex details">
                                    <i className="material-icons mr-2">&#xe556;</i>
                                    <p style={{ color: "inherit" }}>{numbServings} orang</p>
                                </div>
                            </div><br />
                        </Link>
                        <div className="d-flex justify-content-around">
                            <Buttons onClick={() => this.deleteDataHandler(val.id)}>Hapus Rencana</Buttons>
                        </div>

                    </div>
            )
        })
        // } 
        // else {
        //     const { productList } = this.state
        //     return productList.map(val => {
        //         const { product } = val
        //         const { image, productName, price, netto } = product
        //         return (
        //             <div className="product-card d-inline-block mt-4 mx-2 d-flex flex-column align-items-center text-center">
        //                 <Link
        //                     to={`/produk/${val.id}`}
        //                     style={{ textDecoration: "none", color: "inherit" }}
        //                 >
        //                     <img src={image} alt="" style={{ width: "150px", height: "150px", objectFit: "contain" }} />
        //                     <h5 className="mt-2">{productName}</h5>
        //                     <p>{netto}</p>
        //                     <h6 className="mt-2"> {priceFormatter(price)}</h6>
        //                 </Link>
        //             </div>
        //         )
        //     })
        // }
    }

    deleteDataHandler = (id) => {
        swal({
            title: "Anda yakin untuk menghapus data?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    Axios.delete(`${API_URL}/rencana/hapus/${id}`)
                        .then(res => {
                            console.log(res.data)
                            this.getWishilistResep()
                        })
                        .catch(err => {
                            console.log(err)
                            alert('Data Gagal Dihapus!')
                        })
                    swal("Data Berhasil Dihapus!", {
                        icon: "success",
                    });
                }
            });
    }




    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h3 className="text-center my-5">Rencana Saya</h3>
                        {/* <div className="d-flex">
                            <Buttons type="contained" className={`${
                                this.state.activePage === "recipe" ? "active" : null
                                }`} onClick={() => this.setState({ activePage: "recipe" })} >Resep</Buttons>
                            <Buttons type="outlined" className={`ml-3 ${
                                this.state.activePage === "product" ? "active" : null
                                }`} onClick={() => this.setState({ activePage: "product" })}>Produk</Buttons>
                        </div> */}
                        {this.state.recipeList.length > 0 ? (
                            <div className="row d-flex flex-wrap justify-content-center text-center mt-5">
                            {this.renderWishlist()}
                        </div>
                        ) : (
                            <Alert>Rencana Anda Kosong! Untuk Menambah Rencana, Silahkan Tekan Tombol "Simpan Resep" di <Link to="/resep">Halaman Resep</Link></Alert>
                        )}
                        
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Wishlist) 