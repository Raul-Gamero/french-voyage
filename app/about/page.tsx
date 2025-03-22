import Image from "next/image"

// Static page, no dynamic export needed

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About French Voyage Akademie</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our mission is to make learning French accessible, enjoyable, and effective for everyone.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  French Voyage Akademie was founded in 2018 by a group of passionate language teachers who believed
                  that learning French should be more than just memorizing vocabulary and grammar rules.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  We started with a small team of dedicated instructors offering online courses to a handful of
                  students. Today, we've grown into a thriving community of learners and teachers from around the world,
                  united by our love for the French language and culture.
                </p>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000"
                  alt="French Voyage Akademie team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Methodology</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At French Voyage Akademie, we believe in a comprehensive approach to language learning that combines:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Immersive Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our courses immerse you in authentic French content from day one, helping you develop natural language
                  skills.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Structured Progression</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Each course follows a carefully designed curriculum that builds your skills step by step, from
                  beginner to advanced.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cultural Context</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We integrate French culture, history, and customs into our lessons, giving you a deeper understanding
                  of the language.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our instructors are native French speakers with extensive teaching experience and a passion for sharing
              their language and culture.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000"
                    alt="Sophie Dubois"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sophie Dubois</h3>
                <p className="text-gray-600 dark:text-gray-400">Founder & Lead Instructor</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000"
                    alt="Jean-Pierre Martin"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Jean-Pierre Martin</h3>
                <p className="text-gray-600 dark:text-gray-400">Senior Instructor</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000"
                    alt="Marie Leclerc"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Marie Leclerc</h3>
                <p className="text-gray-600 dark:text-gray-400">Curriculum Developer</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <ul className="space-y-4 list-disc pl-5">
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">Excellence:</span> We strive for excellence in
                everything we do, from our curriculum design to our teaching methods.
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">Inclusivity:</span> We believe that everyone
                should have access to quality language education, regardless of their background or prior experience.
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">Innovation:</span> We continuously explore new
                teaching methods and technologies to enhance the learning experience.
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">Community:</span> We foster a supportive
                community where learners can connect, practice, and grow together.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

