import { useEffect, useMemo, useRef, useState } from "react";
import {
  Library,
  Subscriber,
  BasicBorrowPlan,
  ExtendTimeDecorator,
  SpecialEditionDecorator,
  SearchByTitleStrategy,
  SearchByAuthorStrategy,
  SearchByGenreStrategy,
} from "./domain/librarySystem";
import "./App.css";

function App() {
  const library = useMemo(() => Library.getInstance(), []);
  const subscribersRef = useRef([
    new Subscriber("Thủ thư A", "staff"),
    new Subscriber("Độc giả B", "reader"),
  ]);
  const hasInitializedRef = useRef(false);

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    genre: "",
    type: "paper",
  });
  const [borrowForm, setBorrowForm] = useState({
    user: "",
    extraDays: 0,
    specialEdition: "",
  });
  const [searchMode, setSearchMode] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    subscribersRef.current.forEach((subscriber) =>
      library.subscribe(subscriber),
    );

    if (library.getAllBooks().length === 0) {
      library.addBook("paper", {
        title: "Lập Trình Hướng Đối Tượng",
        author: "Nguyễn Văn A",
        genre: "Công nghệ",
      });
      library.addBook("ebook", {
        title: "React Design Patterns",
        author: "Lê Thị B",
        genre: "Công nghệ",
      });
      library.addBook("audio", {
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        genre: "Kỹ năng sống",
      });
    }

    hasInitializedRef.current = true;
    rerender();
  }, [library]);

  const strategies = {
    title: new SearchByTitleStrategy(),
    author: new SearchByAuthorStrategy(),
    genre: new SearchByGenreStrategy(),
  };

  const books = library.searchBooks(strategies[searchMode], searchKeyword);
  const notifications = library.getNotifications();

  const handleAddBook = (event) => {
    event.preventDefault();

    try {
      library.addBook(bookForm.type, {
        title: bookForm.title,
        author: bookForm.author,
        genre: bookForm.genre,
      });

      setBookForm({ title: "", author: "", genre: "", type: bookForm.type });
      setMessage("Thêm sách thành công");
      rerender();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleBorrowBook = (bookId) => {
    try {
      if (!borrowForm.user.trim()) {
        throw new Error("Vui lòng nhập tên người mượn");
      }

      let borrowPlan = new BasicBorrowPlan();
      const extraDays = Number(borrowForm.extraDays);

      if (Number.isFinite(extraDays) && extraDays > 0) {
        borrowPlan = new ExtendTimeDecorator(borrowPlan, extraDays);
      }

      if (borrowForm.specialEdition.trim()) {
        borrowPlan = new SpecialEditionDecorator(
          borrowPlan,
          borrowForm.specialEdition.trim(),
        );
      }

      library.borrowBook(bookId, borrowForm.user.trim(), borrowPlan);
      setMessage("Mượn sách thành công");
      rerender();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReturnBook = (bookId) => {
    try {
      library.returnBook(bookId);
      setMessage("Trả sách thành công");
      rerender();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCheckOverdue = () => {
    const overdueBooks = library.checkOverdueBooks();
    setMessage(`Đã quét quá hạn: ${overdueBooks.length} sách`);
    rerender();
  };

  return (
    <div className="page" key={refreshKey}>
      <header className="hero">
        <h1>Hệ Thống Quản Lý Thư Viện</h1>
        <p className="subtitle">
          Singleton, Factory Method, Strategy, Observer, Decorator
        </p>
        {message && <p className="message">{message}</p>}
      </header>

      <section className="panel">
        <h2>1) Thêm Sách Mới (Factory Method)</h2>
        <form className="grid-form" onSubmit={handleAddBook}>
          <input
            placeholder="Tên sách"
            value={bookForm.title}
            onChange={(event) =>
              setBookForm((prev) => ({ ...prev, title: event.target.value }))
            }
            required
          />
          <input
            placeholder="Tác giả"
            value={bookForm.author}
            onChange={(event) =>
              setBookForm((prev) => ({ ...prev, author: event.target.value }))
            }
            required
          />
          <input
            placeholder="Thể loại"
            value={bookForm.genre}
            onChange={(event) =>
              setBookForm((prev) => ({ ...prev, genre: event.target.value }))
            }
            required
          />
          <select
            value={bookForm.type}
            onChange={(event) =>
              setBookForm((prev) => ({ ...prev, type: event.target.value }))
            }
          >
            <option value="paper">Sách giấy</option>
            <option value="ebook">Sách điện tử</option>
            <option value="audio">Sách nói</option>
          </select>
          <button type="submit">Thêm Sách</button>
        </form>
      </section>

      <section className="panel">
        <h2>2) Tìm Kiếm Sách (Strategy)</h2>
        <div className="search-row">
          <select
            value={searchMode}
            onChange={(event) => setSearchMode(event.target.value)}
          >
            <option value="title">Theo tên</option>
            <option value="author">Theo tác giả</option>
            <option value="genre">Theo thể loại</option>
          </select>
          <input
            placeholder="Nhập từ khóa tìm kiếm"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
        </div>
      </section>

      <section className="panel">
        <h2>3) Mượn / Trả Sách (Decorator)</h2>
        <div className="grid-form">
          <input
            placeholder="Tên người mượn"
            value={borrowForm.user}
            onChange={(event) =>
              setBorrowForm((prev) => ({ ...prev, user: event.target.value }))
            }
          />
          <input
            type="number"
            min="0"
            placeholder="Gia hạn thêm (ngày)"
            value={borrowForm.extraDays}
            onChange={(event) =>
              setBorrowForm((prev) => ({
                ...prev,
                extraDays: event.target.value,
              }))
            }
          />
          <input
            placeholder="Phiên bản đặc biệt (chữ nổi/bản dịch...)"
            value={borrowForm.specialEdition}
            onChange={(event) =>
              setBorrowForm((prev) => ({
                ...prev,
                specialEdition: event.target.value,
              }))
            }
          />
          <button type="button" onClick={handleCheckOverdue}>
            Quét Sách Quá Hạn
          </button>
        </div>

        <div className="book-list">
          {books.map((book) => (
            <article key={book.id} className="book-card">
              <h3>{book.title}</h3>
              <p>Tác giả: {book.author}</p>
              <p>Thể loại: {book.genre}</p>
              <p>Loại sách: {book.type}</p>
              <p>
                Trạng thái:{" "}
                {book.isBorrowed
                  ? `Đang mượn bởi ${book.borrowedBy}`
                  : "Có sẵn"}
              </p>
              {book.isBorrowed && (
                <>
                  <p>Hạn trả: {new Date(book.dueDate).toLocaleDateString()}</p>
                  <p>Gói mượn: {book.borrowPlan}</p>
                </>
              )}

              <div className="actions">
                {!book.isBorrowed ? (
                  <button
                    type="button"
                    onClick={() => handleBorrowBook(book.id)}
                  >
                    Mượn Sách
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReturnBook(book.id)}
                  >
                    Trả Sách
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>4) Thông Báo (Observer)</h2>
        <ul className="notification-list">
          {notifications.length === 0 && <li>Chưa có thông báo.</li>}
          {notifications.map((item) => (
            <li key={item.id}>
              <strong>{item.message}</strong>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
