import { useEffect, useState } from 'react';
import { Box } from './App.styled';
import { Searchbar } from '../Searchbar';
import { ImageGallery } from '../ImageGallery';
import { Button } from '../Button';
import { Loader } from 'components/Loader';
import { Modal } from '../Modal';
import * as API from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currImg, setCurrImg] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true);

        const images = await API.getImages(query, page);

        if (images.totalHits > API.perPage) {
          setShowLoadMore(true);
        }

        if (page + 1 > Math.ceil(images.totalHits / API.perPage)) {
          setIsLoading(false);
          setShowLoadMore(false);
        }

        if (images.total === 0) {
          toast.warn('Your search did not return any results.', {
            theme: 'dark',
          });
          setIsLoading(false);
          return;
        }

        setImages(state => [...state, ...images.hits]);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [page, query]);

  const handleFormSubmit = async ({ query: keyword }) => {
    if (keyword === '') {
      toast.warn('In the Search field, enter the text to be searched.', {
        theme: 'dark',
      });
      return;
    }

    setPage(1);
    setQuery(keyword);
    setImages([]);

    // if (query === keyword && page === 1) {
    //   try {
    //     setIsLoading(true);

    //     const fetchImages = API.getImages(query, page);

    //     setImages([images.hits]);
    //     setIsLoading(false);
    //   } catch (error) {
    //     setIsLoading(false);
    //     setError(true);
    //   }
    // }
  };

  const loadMore = () => setPage(state => state + 1);

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const handleImgClick = (largeImageURL, tags) => {
    toggleModal();
    setCurrImg({ largeImageURL, tags });
  };

  return (
    <Box>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery images={images} onClick={handleImgClick} />
      {showLoadMore && <Button onLoadMore={loadMore} />}
      <Loader isLoading={isLoading} />
      {showModal && (
        <Modal
          onClose={toggleModal}
          link={currImg.largeImageURL}
          tags={currImg.tags}
        />
      )}
      <ToastContainer />
      {error && toast.error(`Oops something went wrong, try again.`)}
    </Box>
  );
}

// export class App extends Component {
//   state = {
//     page: 1,
//     query: '',
//     images: [],
//     error: false,
//     isLoading: false,
//     showModal: false,
//     currImg: null,
//     showLoadMore: false,
//   };

//   async componentDidUpdate(_, prevState) {
//     const prevQuery = prevState.query;
//     const nextQuery = this.state.query;

//     const prevPage = prevState.page;
//     const nextPage = this.state.page;

//     if (prevPage !== nextPage || prevQuery !== nextQuery) {
//       try {
//         this.setState({ isLoading: true });

//         const images = await API.getImages(nextQuery, nextPage);

//         if (images.totalHits > API.perPage) {
//           this.setState({ showLoadMore: true });
//         }

//         if (nextPage + 1 > Math.ceil(images.totalHits / API.perPage)) {
//           this.setState({ isLoading: false, showLoadMore: false });
//         }

//         if (images.total === 0) {
//           toast.warn('Your search did not return any results.', {
//             theme: 'dark',
//           });
//           this.setState({ isLoading: false });
//           return;
//         }

//         this.setState(prevState => ({
//           images: [...prevState.images, ...images.hits],
//           isLoading: false,
//         }));
//       } catch (error) {
//         this.setState({ error: true, isLoading: false });
//       }
//     }
//   }

//   handleFormSubmit = async ({ query: keyword }) => {
//     const { query, page } = this.state;

//     if (keyword === '') {
//       toast.warn('In the Search field, enter the text to be searched.', {
//         theme: 'dark',
//       });
//       return;
//     }

//     this.setState({ page: 1, query: keyword, images: [] });

//     if (query === keyword && page === 1) {
//       try {
//         this.setState({ isLoading: true });

//         const images = await API.getImages(query, page);

//         this.setState({
//           images: [...images.hits],
//           isLoading: false,
//         });
//       } catch (error) {
//         this.setState({ error: true, isLoading: false });
//       }
//     }
//   };

//   loadMore = () => {
//     this.setState(prevState => ({ page: prevState.page + 1 }));
//   };

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//   };

//   handleImgClick = (largeImageURL, tags) => {
//     this.toggleModal();
//     this.setState({ currImg: { largeImageURL, tags } });
//   };

//   render() {
//     const { images, isLoading, showModal, currImg, error, showLoadMore } =
//       this.state;

//     return (
//       <Box>
//         <Searchbar onSubmit={this.handleFormSubmit} />
//         <ImageGallery images={images} onClick={this.handleImgClick} />
//         {showLoadMore && <Button onLoadMore={this.loadMore} />}
//         <Loader isLoading={isLoading} />
//         {showModal && (
//           <Modal
//             onClose={this.toggleModal}
//             link={currImg.largeImageURL}
//             tags={currImg.tags}
//           />
//         )}
//         <ToastContainer />
//         {error && toast.error(`Oops something went wrong, try again.`)}
//       </Box>
//     );
//   }
// }
