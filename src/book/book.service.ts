import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
    try {
      const book = new Book();
      book.name = createBookDto.name;
      book.description = createBookDto.description;
      book.author = createBookDto.author;
      book.price = createBookDto.price;
      return this.bookRepository.save(book);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  findAll(): Promise<Book[]> {
    try {
      return this.bookRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Id must be provided');
    }
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      return book;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch a book');
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    if (!id) {
      throw new BadRequestException('Id must be provided');
    }
    const existingBook = await this.bookRepository.findOne({ where: { id } });

    if (!existingBook) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    try {
      await this.bookRepository.update(id, updateBookDto);
      return { ...existingBook, ...updateBookDto };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update book',
        error.message,
      );
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('Id must be provided');
    }
    const find = await this.bookRepository.findOne({ where: { id } });
    if (!find) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    try {
      await this.bookRepository.delete(id);
      return { message: 'Book deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete book',
        error.message,
      );
    }
  }
}
