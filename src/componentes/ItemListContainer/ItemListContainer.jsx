import { useState, useEffect } from 'react';
import ItemList from '../ItemList/ItemList';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';

const ItemListContainer = ({ greeting }) => {
  const [productos, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const collectionRef = categoryId
          ? query(collection(db, 'products'), where('category', '==', categoryId))
          : collection(db, 'products');

        const querySnapshot = await getDocs(collectionRef);

        const productsAdapted = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        setProducts(productsAdapted);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>
        {greeting}
        Mis productos
      </h2>
      {loading ? <p>Loading...</p> : <ItemList productos={productos} />}
    </>
  );
};

export default ItemListContainer;
