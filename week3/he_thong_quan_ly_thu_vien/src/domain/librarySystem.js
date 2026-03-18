// -----------------------------
// 1) Factory Method Pattern
// -----------------------------
class Book {
  constructor({ id, title, author, genre, type }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.type = type;
    this.isBorrowed = false;
    this.borrowedBy = null;
    this.dueDate = null;
    this.borrowPlan = null;
  }
}

class PaperBook extends Book {
  constructor(data) {
    super({ ...data, type: "paper" });
  }
}

class EBook extends Book {
  constructor(data) {
    super({ ...data, type: "ebook" });
  }
}

class AudioBook extends Book {
  constructor(data) {
    super({ ...data, type: "audio" });
  }
}

class BookCreator {
  createBook() {
    throw new Error("createBook must be implemented by subclasses");
  }
}

class PaperBookCreator extends BookCreator {
  createBook(data) {
    return new PaperBook(data);
  }
}

class EBookCreator extends BookCreator {
  createBook(data) {
    return new EBook(data);
  }
}

class AudioBookCreator extends BookCreator {
  createBook(data) {
    return new AudioBook(data);
  }
}

class BookFactory {
  static creators = {
    paper: new PaperBookCreator(),
    ebook: new EBookCreator(),
    audio: new AudioBookCreator(),
  };

  static createBook(type, data) {
    const creator = BookFactory.creators[type];
    if (!creator) {
      throw new Error(`Unsupported book type: ${type}`);
    }

    return creator.createBook(data);
  }
}

// -----------------------------
// 2) Strategy Pattern
// -----------------------------
class SearchStrategy {
  search() {
    throw new Error("search must be implemented by concrete strategy");
  }
}

class SearchByTitleStrategy extends SearchStrategy {
  search(books, keyword) {
    const query = keyword.toLowerCase();
    return books.filter((book) => book.title.toLowerCase().includes(query));
  }
}

class SearchByAuthorStrategy extends SearchStrategy {
  search(books, keyword) {
    const query = keyword.toLowerCase();
    return books.filter((book) => book.author.toLowerCase().includes(query));
  }
}

class SearchByGenreStrategy extends SearchStrategy {
  search(books, keyword) {
    const query = keyword.toLowerCase();
    return books.filter((book) => book.genre.toLowerCase().includes(query));
  }
}

// -----------------------------
// 3) Observer Pattern
// -----------------------------
class NotificationCenter {
  constructor() {
    this.observers = new Set();
    this.notifications = [];
  }

  subscribe(observer) {
    this.observers.add(observer);
  }

  unsubscribe(observer) {
    this.observers.delete(observer);
  }

  notify(eventType, payload) {
    const message = this.#buildMessage(eventType, payload);
    const notification = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      eventType,
      payload,
      message,
      createdAt: new Date().toISOString(),
    };

    this.notifications = [notification, ...this.notifications];
    this.observers.forEach((observer) => observer.update(notification));
  }

  getNotifications() {
    return [...this.notifications];
  }

  #buildMessage(eventType, payload) {
    if (eventType === "NEW_BOOK") {
      return `Sách mới: "${payload.title}" (${payload.author})`;
    }

    if (eventType === "BOOK_BORROWED") {
      return `${payload.user} đã mượn "${payload.title}"`;
    }

    if (eventType === "BOOK_RETURNED") {
      return `${payload.user} đã trả "${payload.title}"`;
    }

    if (eventType === "OVERDUE_BOOK") {
      return `Sách quá hạn: "${payload.title}" đang do ${payload.user} mượn`;
    }

    return "Thông báo mới";
  }
}

class Subscriber {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.inbox = [];
  }

  update(notification) {
    this.inbox = [notification, ...this.inbox];
  }
}

// -----------------------------
// 4) Decorator Pattern
// -----------------------------
class BorrowPlan {
  getBorrowDays() {
    throw new Error("getBorrowDays must be implemented");
  }

  getDescription() {
    throw new Error("getDescription must be implemented");
  }
}

class BasicBorrowPlan extends BorrowPlan {
  constructor(days = 14) {
    super();
    this.days = days;
  }

  getBorrowDays() {
    return this.days;
  }

  getDescription() {
    return `Mượn cơ bản (${this.days} ngày)`;
  }
}

class BorrowPlanDecorator extends BorrowPlan {
  constructor(plan) {
    super();
    this.plan = plan;
  }

  getBorrowDays() {
    return this.plan.getBorrowDays();
  }

  getDescription() {
    return this.plan.getDescription();
  }
}

class ExtendTimeDecorator extends BorrowPlanDecorator {
  constructor(plan, extraDays) {
    super(plan);
    this.extraDays = extraDays;
  }

  getBorrowDays() {
    return this.plan.getBorrowDays() + this.extraDays;
  }

  getDescription() {
    return `${this.plan.getDescription()} + Gia hạn ${this.extraDays} ngày`;
  }
}

class SpecialEditionDecorator extends BorrowPlanDecorator {
  constructor(plan, editionLabel) {
    super(plan);
    this.editionLabel = editionLabel;
  }

  getDescription() {
    return `${this.plan.getDescription()} + Phiên bản đặc biệt: ${this.editionLabel}`;
  }
}

// -----------------------------
// 5) Singleton Pattern
// -----------------------------
class Library {
  static instance;

  constructor() {
    if (Library.instance) {
      throw new Error("Use Library.getInstance() instead of new Library()");
    }

    this.books = [];
    this.notificationCenter = new NotificationCenter();
  }

  static getInstance() {
    if (!Library.instance) {
      Library.instance = new Library();
    }

    return Library.instance;
  }

  subscribe(observer) {
    this.notificationCenter.subscribe(observer);
  }

  unsubscribe(observer) {
    this.notificationCenter.unsubscribe(observer);
  }

  getNotifications() {
    return this.notificationCenter.getNotifications();
  }

  addBook(type, data) {
    const newBook = BookFactory.createBook(type, {
      ...data,
      id: data.id || `B-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    });

    this.books.push(newBook);

    this.notificationCenter.notify("NEW_BOOK", {
      title: newBook.title,
      author: newBook.author,
    });

    return newBook;
  }

  getAllBooks() {
    return [...this.books];
  }

  borrowBook(bookId, user, borrowPlan = new BasicBorrowPlan()) {
    const target = this.books.find((book) => book.id === bookId);
    if (!target) {
      throw new Error("Không tìm thấy sách");
    }

    if (target.isBorrowed) {
      throw new Error("Sách đang được mượn");
    }

    target.isBorrowed = true;
    target.borrowedBy = user;
    target.borrowPlan = borrowPlan.getDescription();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowPlan.getBorrowDays());
    target.dueDate = dueDate.toISOString();

    this.notificationCenter.notify("BOOK_BORROWED", {
      title: target.title,
      user,
    });

    return target;
  }

  returnBook(bookId) {
    const target = this.books.find((book) => book.id === bookId);
    if (!target) {
      throw new Error("Không tìm thấy sách");
    }

    if (!target.isBorrowed) {
      throw new Error("Sách chưa được mượn");
    }

    const borrower = target.borrowedBy;

    target.isBorrowed = false;
    target.borrowedBy = null;
    target.dueDate = null;
    target.borrowPlan = null;

    this.notificationCenter.notify("BOOK_RETURNED", {
      title: target.title,
      user: borrower,
    });

    return target;
  }

  checkOverdueBooks() {
    const now = Date.now();
    const overdueBooks = this.books.filter(
      (book) =>
        book.isBorrowed &&
        book.dueDate &&
        new Date(book.dueDate).getTime() < now,
    );

    overdueBooks.forEach((book) => {
      this.notificationCenter.notify("OVERDUE_BOOK", {
        title: book.title,
        user: book.borrowedBy,
      });
    });

    return overdueBooks;
  }

  searchBooks(strategy, keyword) {
    if (!keyword.trim()) {
      return this.getAllBooks();
    }

    return strategy.search(this.books, keyword);
  }
}

export {
  Library,
  Subscriber,
  BasicBorrowPlan,
  ExtendTimeDecorator,
  SpecialEditionDecorator,
  SearchByTitleStrategy,
  SearchByAuthorStrategy,
  SearchByGenreStrategy,
};
