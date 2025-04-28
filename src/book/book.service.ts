import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    // private readonly book:Book
  ) {}

  create(createBookDto: CreateBookDto) {
    const book = new Book();
    book.name = createBookDto.name;
    book.description = createBookDto.description;
    book.author = createBookDto.author;
    book.price = createBookDto.price;
    return this.bookRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new BadGatewayException('Book not found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = await this.bookRepository.findOne({ where: { id } });

    if (!existingBook) {
      throw new NotFoundException('Id not found');
    }
    await this.bookRepository.update(id, updateBookDto);
    return { ...existingBook, ...updateBookDto };
  }

  async remove(id: number) {
    const find = await this.bookRepository.findOne({ where: { id } });
    if (!find) {
      throw new NotFoundException('Not found');
    }
    await this.bookRepository.delete(id);
    return { message: 'Book deleted' };
  }
}
